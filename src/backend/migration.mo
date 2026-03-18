import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type OldWithdrawalRequest = {
    id : Nat;
    user : Principal;
    amount : Int;
    status : { #pending; #approved; #rejected };
    note : Text;
    createdAt : Time.Time;
  };

  type OldActor = {
    withdrawalRequests : Map.Map<Nat, OldWithdrawalRequest>;
  };

  type NewWithdrawalRequest = {
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

  type NewActor = {
    withdrawalRequests : Map.Map<Nat, NewWithdrawalRequest>;
  };

  public func run(old : OldActor) : NewActor {
    let newWithdrawalRequests = old.withdrawalRequests.map<Nat, OldWithdrawalRequest, NewWithdrawalRequest>(
      func(_id, oldRequest) {
        { oldRequest with bankAccountName = ""; bankAccountNumber = ""; ifscCode = ""; upiId = "" };
      }
    );
    { old with withdrawalRequests = newWithdrawalRequests };
  };
};
