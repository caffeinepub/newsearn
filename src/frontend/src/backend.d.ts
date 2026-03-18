import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Article {
    id: bigint;
    title: string;
    content: string;
    createdAt: Time;
    summary: string;
    imageUrl: string;
    category: string;
}
export interface WithdrawalRequest {
    id: bigint;
    bankAccountNumber: string;
    status: Variant_pending_approved_rejected;
    ifscCode: string;
    note: string;
    createdAt: Time;
    user: Principal;
    upiId: string;
    bankAccountName: string;
    amount: bigint;
}
export type Time = bigint;
export interface UserStats {
    referralCode: string;
    coinBalance: bigint;
    totalEarned: bigint;
    referralCount: bigint;
    dailyReadCount: bigint;
    lastResetDate: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addArticle(title: string, content: string, summary: string, category: string, imageUrl: string): Promise<bigint>;
    approveWithdrawal(withdrawalId: bigint, note: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimReward(): Promise<void>;
    deleteArticle(articleId: bigint): Promise<void>;
    getAllUsers(): Promise<Array<[Principal, UserStats]>>;
    getArticle(articleId: bigint): Promise<Article | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyWithdrawals(): Promise<Array<WithdrawalRequest>>;
    getNews(page: bigint, pageSize: bigint): Promise<Array<Article>>;
    getReferralCode(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStats(): Promise<UserStats>;
    getWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(): Promise<void>;
    registerWithReferral(referralCode: string): Promise<void>;
    rejectWithdrawal(withdrawalId: bigint, note: string): Promise<void>;
    requestWithdrawal(amount: bigint, bankAccountName: string, bankAccountNumber: string, ifscCode: string, upiId: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startReadingSession(articleId: bigint): Promise<void>;
    updateArticle(id: bigint, title: string, content: string, summary: string, category: string, imageUrl: string): Promise<void>;
}
