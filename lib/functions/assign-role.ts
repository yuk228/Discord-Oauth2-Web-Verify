export async function assignRole(userId: string) {
  try {
    const guildId = process.env.DISCORD_GUILD_ID;
    const roleId = process.env.DISCORD_ROLE_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;

    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to assign role");
    }
  } catch (error) {
    console.log("Error in assign role:", error);
    throw error;
  }
}
