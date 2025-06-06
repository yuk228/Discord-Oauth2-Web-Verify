import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { SessionData } from "@/lib/type";

export async function GET(req: NextRequest) {
    const res = new NextResponse();
    try {
        const session = await getIronSession<SessionData>(req, res, sessionOptions);
        
        if (!session.csrfToken) {
            const errorResponse = NextResponse.json(
                { error: "Authentication failed" }, 
                { status: 400 }
            );
            const cookie = res.headers.get("Set-Cookie");
            
            if (cookie) {
                errorResponse.headers.set("Set-Cookie", cookie);
            }
            return errorResponse;
        }

        const successResponse = NextResponse.json(
            { csrfToken: session.csrfToken }, 
            { status: 200 }
        );
        const cookie = res.headers.get("Set-Cookie");
        if (cookie) {
            successResponse.headers.set("Set-Cookie", cookie);
        }
        return successResponse;
    } catch (error) {
        console.error("Error in /api/csrf:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}