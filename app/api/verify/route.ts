import { logger } from "@/lib/functions/logger"
import { NextRequest, NextResponse } from "next/server"
import { assignRole } from "@/lib/functions/assign-role"
import { getInfo } from "@/lib/functions/get-info"
import { getToken, verifyToken } from "@/lib/functions/verify"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, token } = body;
        if (!code || !token) {
            throw new Error("required body not provided");
        }
        await verifyToken(token);
        const getTokenResult = await getToken(code);
        const userInfo = await getInfo(getTokenResult.access_token);
        await assignRole(userInfo.id.toString());
        await logger(userInfo);

        return NextResponse.json({ status: 200 });
        
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}