export type ChatroomType = {
    _id: string;
    chatroomName: string;
    userId: string;
    createdAt: Date;
    chatroomId: number;
};

export type MessageType = {
    userId: string;
    username: string;
    message: string;
    timestamp: Date;
};

export type CardType = {
    chatroomUserId:number,
    chatroomName:string,
    createdAt:Date,
    creatorUsername:string
    chatroomId:number
}

export type RespType = {
    message:string
}

export type UserType = {
    email:string,
    isAdmin:boolean,
    joinedOn:Date,
    userId:number,
    username:string,
    _id:string
}