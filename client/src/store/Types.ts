export type ChatroomType = {
    _id: string;
    chatroomName: string;
    userId: string;
    createdAt: Date;
};

export type MessageType = {
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
};

export type CardType = {
    chatroomName:string,
    createdAt:Date,
    _id:string
}

export type RespType = {
    message:string
}

export type UserType = {
    email:string,
    isAdmin:Boolean,
    joinedOn:Date,
    username:string,
    _id:string
}