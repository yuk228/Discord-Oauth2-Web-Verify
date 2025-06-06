import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_PASSWORD!,
    cookieName: "discord-verify-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
    },
};
