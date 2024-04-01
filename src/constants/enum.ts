export enum TokenType {
  AccessToken,
  RefreshToken,
  EmailVerifyToken,
}
export enum UserVerifyStatus {
  UnVerified,
  Verified, // đã xác thực email
  Banned, // bị khóa
}
export enum StoryCompletedStatus {
  Updating,
  Completed,
}
export enum StatusAcceptStory {
  Pending,
  Resolve,
  Reject,
}
