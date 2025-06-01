export interface DiscordUser {
    id: number;
    username: string;
    global_name: string;
    avatar_id: string;
    locale: string;
    mfa_enabled: boolean;
    verified: boolean;
}