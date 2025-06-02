import { DiscordUser } from "../type"


export async function getInfo(accessToken: string): Promise<DiscordUser> {
    try {
        const response = await fetch(`https://discord.com/api/users/@me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
        });
        const userInfo = await response.json();
        return userInfo as DiscordUser;
    } catch {
        return {
            id: 0,
            username: "",
            global_name: "",
            avatar_id: "",
            locale: "",
            mfa_enabled: false,
        };
    }
}