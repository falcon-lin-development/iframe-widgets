class ChatUserModel {
  userType: string;
  role: string;
  userId: string;
  displayName: string;
  profileImageUrl: string;
  keyboardStatus: string;
  lastSeenTimestamp: number;

  constructor(
    userType: string,
    role: string,
    userId: string,
    displayName: string,
    profileImageUrl: string,
    keyboardStatus: string,
    lastSeenTimestamp: number,
  ) {
    this.userType = userType;
    this.role = role;
    this.userId = userId;
    this.displayName = displayName;
    this.profileImageUrl = profileImageUrl;
    this.keyboardStatus = keyboardStatus;
    this.lastSeenTimestamp = lastSeenTimestamp;
  }
}

class MessageModel {
  messageId: string;
  messageTimestamp: number;
  roomId: string;
  fromUser: ChatUserModel;
  messageType: string;
  messageContent: any;
  sentTimestamp: string;
  deliveredTimestamp: string;
  readTimestamp: string;
  isEdited: boolean;

  constructor(
    messageId: string,
    messageTimestamp: number,
    roomId: string,
    fromUser: ChatUserModel,
    messageType: string,
    messageContent: any,
    sentTimestamp: string,
    deliveredTimestamp: string,
    readTimestamp: string,
    isEdited: boolean,
  ) {
    this.messageId = messageId;
    this.messageTimestamp = messageTimestamp;
    this.roomId = roomId;
    this.fromUser = fromUser;
    this.messageType = messageType;
    this.messageContent = messageContent;
    this.sentTimestamp = sentTimestamp;
    this.deliveredTimestamp = deliveredTimestamp;
    this.readTimestamp = readTimestamp;
    this.isEdited = isEdited;
  }
}

export { ChatUserModel, MessageModel };
