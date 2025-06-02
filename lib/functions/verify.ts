export async function verifyToken(token: string) {
    const verificationResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                secret: process.env.TURNSTILE_SECRET_KEY as string,
                response: token,
            }),
        }
    );

    return await verificationResponse.json();
};

export async function getToken(code: string) {
    try {
        const body = new URLSearchParams({
            "grant_type": "authorization_code",
            "code": String(code),
            "redirect_uri": `${process.env.BASE_URL}/api/callback`,
        }).toString();
    
        const token = await fetch(`https://discord.com/api/v10/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")
            },
            body: body
        });
    
        if (!token.ok) {
            throw new Error("Failed to fetch token");
    
        }
    
        return await token.json();
    } catch (error) {
        console.log("Error: ", error);
        return { success: false };
    }


};