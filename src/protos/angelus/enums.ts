export enum YGOProAngelusProcessStatus {
  Continue = 0,
  AwaitResponse = 1,
  Win = 2,
  Retry = 3,
}

export enum YGOProAngelusCoreMessageType {
  DebugMessage = 0,
  ScriptError = 1,
}

export enum YGOProAngelusErrorCode {
  BadRequest = 1,
  BadState = 2,
  CoreError = 3,
  CoreTimeout = 4,
}
