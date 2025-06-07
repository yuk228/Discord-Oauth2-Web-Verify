import { DiscordUser } from "../type";

export async function getInfo(accessToken: string): Promise<DiscordUser> {
    try {
        const res = await fetch(`https://discord.com/api/users/@me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const userInfo = await res.json();
        return userInfo as DiscordUser;
    } catch (error) {
        console.error("Error in getInfo:", error);
        throw error;
    }
}
