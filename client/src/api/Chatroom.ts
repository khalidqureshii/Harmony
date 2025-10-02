import LINK from "@/store/Link";

export async function deleteMessage (data: { userId: string, _id: string}) {
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

export async function editMessage (data: {_id: string, userId: string, newMessage: string}) {
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

export const fetchMessages = async (chatroomId: string) => {
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

export const fetchChatroom = async (chatroomId: string) => {
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

export const fetchApprovalRequest = async (chatroomId: string, userId: string) => {
    const response = await fetch(LINK + `api/uic/fetchRequests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
            userId: userId
        }),
    });
    const resp = await response.json();
    return resp;
}

export const approveRequest = async (chatroomId: string, userId: string, selectedUserId: string) => {
    const response = await fetch(LINK + `api/uic/approveUserInChatroom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
            userId: selectedUserId,
            adminId: userId
        }),
    });
    const resp = await response.json();
    return resp;
}

export const rejectRequest = async (chatroomId: string, userId: string, selectedUserId: string) => {
    const response = await fetch(LINK + `api/uic/rejectUserInChatroom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
            userId: selectedUserId,
            adminId: userId
        }),
    });
    const resp = await response.json();
    return resp;
}

export const leaveChatroom = async (chatroomId: string, userId: string) => {
    const response = await fetch(LINK + `api/uic/leaveChatroom`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
            chatroomId: chatroomId,
            userId: userId,
        }),
    });
    const resp = await response.json();
    return resp;
}

