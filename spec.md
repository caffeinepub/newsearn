# NewsEarn

## Current State
- Admin token entry flow works but after claiming admin, user must manually refresh to see admin tab
- `AdminSetupDialog` only renders when `isAdmin === false` (not when undefined/loading)
- Withdrawal requests only capture coin amount; no bank transfer details collected
- Admin can see withdrawal requests but has no bank account info to process transfers

## Requested Changes (Diff)

### Add
- Bank transfer details fields to withdrawal form: account holder name, bank account number, IFSC code, UPI ID (optional)
- Bank details displayed in admin withdrawal panel per request
- Backend `WithdrawalRequest` type extended with bank details fields

### Modify
- `requestWithdrawal` backend function to accept bank details
- Withdrawal form in `FeedPage` to collect bank details
- Admin withdrawals table to show bank details columns
- `AdminSetupDialog` visibility condition: show when `!isAdmin` (includes undefined/loading state) AND user is logged in
- After successful admin claim, force `window.location.reload()` so admin panel appears immediately

### Remove
- Nothing removed

## Implementation Plan
1. Update backend `WithdrawalRequest` type with bankAccountName, bankAccountNumber, ifscCode, upiId fields
2. Update `requestWithdrawal` function signature to accept bank details
3. Update frontend withdrawal form with bank detail inputs
4. Update admin panel to show bank details in withdrawals tab
5. Fix `AdminSetupDialog` to reload page after success and fix visibility condition
