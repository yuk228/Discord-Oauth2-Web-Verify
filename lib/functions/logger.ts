import { DiscordUser } from "../type";

export const logger = async ( 
  userInfo: DiscordUser, 
) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK || "";

        const fields = [
          {
            name: "👤ユーザー",
            value: `${userInfo.global_name}(${userInfo.username || userInfo.username})`,
            inline: false
          },
          {
            name: "✉️ユーザー情報",
            value: `ID: \`${userInfo.id}\`\n言語: \`${userInfo.locale}\`\nMFA: \`${userInfo.mfa_enabled}\`\nVerified: \`${userInfo.verified }\``,
            inline: false
          },
        ];

        const embed = {
            title: "✅認証成功",
            fields: fields,
            thumbnail: {
                url: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar_id}.png`
            },
            color: 0x7e22d2,
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                embeds: [embed],
            }),
        });

        if (!response.ok) {
            throw new Error("Webhook request failed");
        }

        return { success: true };
    } catch {
        return { success: false };
    }
}