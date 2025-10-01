import LINK from "@/store/Link";

export async function fetchChatrooms() {
    const response = await fetch(LINK + "api/chatroom/fetch", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    const resp = await response.json();
    if (!response.ok) {
        throw new Error(resp.message);
    }
    if (!Array.isArray(resp.chatrooms)) {
        throw new Error("Invalid data format: chatrooms is not an array");
    }
    return resp;
}

export const fetchChatroomsForUser = async (userId: string) => {
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


export async function createChatroom(data: {chatroomName: string, userId: string}) {
    const response = await fetch(LINK + "api/chatroom/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chatroomName: data.chatroomName,
            userId: data.userId,
        })
    }); 
    const resp = await response.json();
    if (!response.ok) {
        throw new Error(resp.message);
    }
    else {
        return resp.message;
    }
} 

export const handleUpload = async (file:File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response =  await fetch('http://localhost:5000/api/file/upload', {
        method: 'POST',
        body: formData,
    });
    const resp = await response.json();
    if (response.ok) {
        return resp;
    }
    else throw new Error(resp.message);
};