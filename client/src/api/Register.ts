import LINK from "@/store/Link";

export async function storeData(user:{username: string, email: string, password: string}) {
    console.log(LINK);
    const response = await fetch(LINK + "api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }); 
    const resp_data = await response.json();
    if (response.ok) {
        return resp_data;
    }
    else {
        throw new Error(resp_data.message);
    }
}