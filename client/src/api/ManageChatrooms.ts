import LINK from "@/store/Link";

export async function deleteChatroom(data: {selectedChatroomId:String, userId: String}) {
    const {selectedChatroomId, userId} = data;
    const response = await fetch(LINK + "api/chatroom/remove", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chatroomId:selectedChatroomId,
            userId: userId
        })
    });
    const resp_data = await response.json();
    if (response.ok) {
        await fetch(LINK + "api/chat/deleteChatroomChats", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatroomId:selectedChatroomId,
                userId: userId
            })
        })
        return resp_data;
    }
    else {
        throw new Error(resp_data.message);
    }
}

export async function editChatroom(data: {selectedChatroomId:String, editedName: string}) {
    const response = await fetch(LINK + "api/chatroom/edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            chatroomId:data.selectedChatroomId,
            chatroomName: data.editedName
        })
    });
    const resp_data = await response.json();
    if (response.ok) return resp_data;
    else throw new Error(resp_data.message);
}

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