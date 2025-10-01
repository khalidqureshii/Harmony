import LINK from "@/store/Link";

export async function deleteMessage (data: {chatId:String, userId: String, chatroomId: String}) {
    const response = await fetch(LINK + "api/chat/delete", {
        method:"PATCH",
        headers:{
            "Content-type":"Application/JSON"
        },
        body: JSON.stringify(data)
    });    
    const resp = await response.json();
    return resp;
}

export async function editMessage (data: {chatId: String, userId: String, newMessage: String}) {
    const response = await fetch(LINK + "api/chat/update", {
        method:"PATCH",
        headers:{
            "Content-type":"Application/JSON"
        },
        body: JSON.stringify(data)
    });
    const resp = await response.json();
    return resp;
}

export const fetchMessages = async (chatroomId: String) => {
    const response = await fetch(LINK + `api/chat/fetch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
        }),
    });
    const resp = await response.json();
    return resp;
};

export const fetchChatroom = async (chatroomId: String) => {
    const response = await fetch(LINK + `api/chatroom/getChatroom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
        }),
    });
    const resp = await response.json();
    return resp;
}

export const fetchChatroomForUser = async (userId: String) => {
    const response = await fetch(LINK + `api/chatroom/fetchForUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            userId: userId,
        }),
    });
    const resp = await response.json();
    return resp;
}

export const fetchAllUsers = async () => {
    const response = await fetch(LINK + `api/auth/fetchAllUsers`, {
        method: 'GET',
    });
    const resp = await response.json();
    return resp;
}
