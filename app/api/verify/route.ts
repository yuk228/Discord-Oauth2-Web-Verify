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
        // Turnstile Tokenの検証
        const verificationResult = await verifyToken(token);
        if (!verificationResult.success) {
            throw new Error("Token verification failed");
        }
        // Access Tokenの取得
        const getTokenResult = await getToken(code);
        if (!getTokenResult.success) {
            throw new Error("Failed to fetch token");
        }

        // ユーザー情報の取得
        const userInfo = await getInfo(getTokenResult.access_token);

        // ロールの付与
        const assignRoleResult = await assignRole(userInfo.id.toString());
        
        if (!assignRoleResult.success) {
            throw new Error("Failed to assign role");
        }

        // ログの送信
        const loggerResult = await logger(userInfo);
        if (!loggerResult.success) {
            throw new Error("Failed to send log");
        }

        return NextResponse.json({ status: 200 });
        
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "500" }, { status: 500 });
    }
}