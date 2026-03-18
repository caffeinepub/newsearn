import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Random "mo:core/Random";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Add migration with-clause

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Article = {
    id : Nat;
    title : Text;
    content : Text;
    summary : Text;
    category : Text;
    imageUrl : Text;
    createdAt : Time.Time;
  };

  type UserStats = {
    coinBalance : Int;
    totalEarned : Int;
    dailyReadCount : Int;
    referralCode : Text;
    referralCount : Int;
    lastResetDate : Int;
  };

  type ReadingSession = {
    startTime : Time.Time;
    articleId : Nat;
  };

  type WithdrawalRequest = {
    id : Nat;
    user : Principal;
    amount : Int;
    status : { #pending; #approved; #rejected };
    note : Text;
    createdAt : Time.Time;
    bankAccountName : Text;
    bankAccountNumber : Text;
    ifscCode : Text;
    upiId : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let articles = Map.empty<Nat, Article>();
  let users = Map.empty<Principal, UserStats>();
  let readingSessions = Map.empty<Principal, ReadingSession>();
  let withdrawalRequests = Map.empty<Nat, WithdrawalRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let articlesReadToday = Map.empty<Principal, Map.Map<Nat, Bool>>();
  var nextArticleId = 1;
  var nextWithdrawalId = 1;

  func generateReferralCode() : async Text {
    let randomHelper = Random.crypto();
    let randomNumber = await* randomHelper.natRange(100_000_000, 1_000_000_000);
    "REF-" # randomNumber.toText();
  };

  func getDayNumber(timestamp : Time.Time) : Int {
    timestamp / 86_400_000_000_000;
  };

  func ensureUserExists(caller : Principal) : async () {
    if (not users.containsKey(caller)) {
      let userStats : UserStats = {
        coinBalance = 0;
        totalEarned = 0;
        dailyReadCount = 0;
        referralCode = await generateReferralCode();
        referralCount = 0;
        lastResetDate = getDayNumber(Time.now());
      };
      users.add(caller, userStats);
    };
  };

  func resetDailyCountIfNeeded(caller : Principal, stats : UserStats) : UserStats {
    let currentDay = getDayNumber(Time.now());
    if (currentDay > stats.lastResetDate) {
      articlesReadToday.remove(caller);
      return {
        stats with
        dailyReadCount = 0;
        lastResetDate = currentDay;
      };
    };
    stats;
  };

  // Self-registration: assigns #user role and initializes stats
  public shared ({ caller }) func registerUser() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous users cannot register");
    };
    AccessControl.assignRole(accessControlState, caller, caller, #user);
    await ensureUserExists(caller);
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Registration and Referral
  public shared ({ caller }) func registerWithReferral(referralCode : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous users cannot register");
    };
    if (users.containsKey(caller)) { Runtime.trap("User already registered") };

    AccessControl.assignRole(accessControlState, caller, caller, #user);

    let userStats : UserStats = {
      coinBalance = 0;
      totalEarned = 0;
      dailyReadCount = 0;
      referralCode = await generateReferralCode();
      referralCount = 0;
      lastResetDate = getDayNumber(Time.now());
    };
    users.add(caller, userStats);

    // Find referrer and give them bonus
    for ((referrerPrincipal, referrerStats) in users.entries()) {
      if (referrerStats.referralCode == referralCode and referrerPrincipal != caller) {
        let updatedReferrer = {
          referrerStats with
          coinBalance = referrerStats.coinBalance + 50;
          totalEarned = referrerStats.totalEarned + 50;
          referralCount = referrerStats.referralCount + 1;
        };
        users.add(referrerPrincipal, updatedReferrer);
      };
    };
  };

  public shared ({ caller }) func getReferralCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get referral code");
    };
    await ensureUserExists(caller);
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?stats) { stats.referralCode };
    };
  };

  // Reading Sessions and Rewards
  public shared ({ caller }) func startReadingSession(articleId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can start reading sessions");
    };
    await ensureUserExists(caller);

    let session : ReadingSession = {
      startTime = Time.now();
      articleId;
    };
    readingSessions.add(caller, session);
  };

  public shared ({ caller }) func claimReward() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim rewards");
    };

    let session = switch (readingSessions.get(caller)) {
      case (null) { Runtime.trap("No active reading session") };
      case (?s) { s };
    };

    let now = Time.now();
    let elapsed = now - session.startTime;
    if (elapsed < 10_000_000_000) { Runtime.trap("Must read for at least 10 seconds") };

    let userStats = switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?stats) { resetDailyCountIfNeeded(caller, stats) };
    };

    if (userStats.dailyReadCount >= 250) { Runtime.trap("Daily read limit reached") };

    let readToday = switch (articlesReadToday.get(caller)) {
      case (null) { Map.empty<Nat, Bool>() };
      case (?m) { m };
    };

    if (readToday.containsKey(session.articleId)) {
      Runtime.trap("Article already read today");
    };

    readToday.add(session.articleId, true);
    articlesReadToday.add(caller, readToday);

    let updatedStats = {
      userStats with
      coinBalance = userStats.coinBalance + 100;
      totalEarned = userStats.totalEarned + 100;
      dailyReadCount = userStats.dailyReadCount + 1;
    };
    users.add(caller, updatedStats);
    readingSessions.remove(caller);
  };

  // News Articles - Public Access
  public query ({ caller }) func getNews(page : Nat, pageSize : Nat) : async [Article] {
    let allArticles = articles.values().toArray();
    let start = page * pageSize;
    let end = start + pageSize;
    if (start >= allArticles.size()) {
      return [];
    };
    let actualEnd = if (end > allArticles.size()) { allArticles.size() } else { end };
    allArticles.sliceToArray(start, actualEnd);
  };

  public query ({ caller }) func getArticle(articleId : Nat) : async ?Article {
    articles.get(articleId);
  };

  // User Stats
  public query ({ caller }) func getUserStats() : async UserStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stats");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?stats) { stats };
    };
  };

  // Withdrawal Functions
  public shared ({ caller }) func requestWithdrawal(
    amount : Int,
    bankAccountName : Text,
    bankAccountNumber : Text,
    ifscCode : Text,
    upiId : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    let userStats = switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?stats) { stats };
    };

    if (amount <= 0) { Runtime.trap("Invalid withdrawal amount") };
    if (userStats.coinBalance < amount) { Runtime.trap("Insufficient balance") };

    let request : WithdrawalRequest = {
      id = nextWithdrawalId;
      user = caller;
      amount;
      status = #pending;
      note = "";
      createdAt = Time.now();
      bankAccountName;
      bankAccountNumber;
      ifscCode;
      upiId;
    };
    withdrawalRequests.add(nextWithdrawalId, request);
    nextWithdrawalId += 1;

    let updatedStats = {
      userStats with
      coinBalance = userStats.coinBalance - amount;
    };
    users.add(caller, updatedStats);

    request.id;
  };

  public query ({ caller }) func getMyWithdrawals() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their withdrawals");
    };

    let userWithdrawals = withdrawalRequests.values().toArray().filter(
      func(req) { req.user == caller }
    );
    userWithdrawals;
  };

  // Admin Functions - Article Management
  public shared ({ caller }) func addArticle(title : Text, content : Text, summary : Text, category : Text, imageUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let article : Article = {
      id = nextArticleId;
      title;
      content;
      summary;
      category;
      imageUrl;
      createdAt = Time.now();
    };
    articles.add(nextArticleId, article);
    let id = nextArticleId;
    nextArticleId += 1;
    id;
  };

  public shared ({ caller }) func updateArticle(id : Nat, title : Text, content : Text, summary : Text, category : Text, imageUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (articles.get(id)) {
      case (null) { Runtime.trap("Article not found") };
      case (?existing) {
        let updatedArticle : Article = {
          id;
          title;
          content;
          summary;
          category;
          imageUrl;
          createdAt = existing.createdAt;
        };
        articles.add(id, updatedArticle);
      };
    };
  };

  public shared ({ caller }) func deleteArticle(articleId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    articles.remove(articleId);
  };

  // Admin Functions - User Management
  public query ({ caller }) func getAllUsers() : async [(Principal, UserStats)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    users.entries().toArray();
  };

  // Admin Functions - Withdrawal Management
  public query ({ caller }) func getWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    withdrawalRequests.values().toArray();
  };

  public shared ({ caller }) func approveWithdrawal(withdrawalId : Nat, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (withdrawalRequests.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Withdrawal request already processed");
        };
        let updatedRequest = {
          request with
          status = #approved;
          note;
        };
        withdrawalRequests.add(withdrawalId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func rejectWithdrawal(withdrawalId : Nat, note : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (withdrawalRequests.get(withdrawalId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Withdrawal request already processed");
        };
        let updatedRequest = {
          request with
          status = #rejected;
          note;
        };
        withdrawalRequests.add(withdrawalId, updatedRequest);

        switch (users.get(request.user)) {
          case (null) {};
          case (?userStats) {
            let refundedStats = {
              userStats with
              coinBalance = userStats.coinBalance + request.amount;
            };
            users.add(request.user, refundedStats);
          };
        };
      };
    };
  };
};
