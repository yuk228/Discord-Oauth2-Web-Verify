import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/lib/type";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const res = new NextResponse();
    try {
        const session = await getIronSession<SessionData>(req, res, sessionOptions);
        const code = new URL(req.url).searchParams.get("code");

        if (!code) {
            throw new Error("No code provided");
        }

        const csrfToken = crypto.randomBytes(32).toString("hex");

        session.code = code;
        session.csrfToken = csrfToken;
        await session.save();

        const redirectUrl = new URL("/verify", process.env.BASE_URL);
        const response = NextResponse.redirect(redirectUrl);

        const cookie = res.headers.get("Set-Cookie");
        if (cookie) {
            response.headers.set("Set-Cookie", cookie);
        }

        return response;
    } catch (error) {
        console.error("Error in callback:", error);
        const redirectUrl = new URL("/error", process.env.BASE_URL);
        const response = NextResponse.redirect(redirectUrl);

        const cookie = res.headers.get("Set-Cookie");
        if (cookie) {
            response.headers.set("Set-Cookie", cookie);
        }

        return response;
    }
}
