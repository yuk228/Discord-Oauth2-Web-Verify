
"use client"

import { Turnstile } from "next-turnstile";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";


function Verify() {
    const [token, setToken] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    
    const code = searchParams.get("code");

    const handleVerify = async () => {
        if (!token) return;
        if (!code) return;
        const res = await fetch('/api/verify', {      
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                code
            }),
        })
        const result = await res.json();
        if (result.status === 200) {
            router.push("/success");
        } else {
            router.push("/error");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center ">
            <div className="p-10 rounded-4xl md:w-1/2 max-w-md border border-white/[0.10]">
                <div className="mx-auto">
                    <h1 className="text-xl font-bold mb-4 text-center">認証を完了してください</h1>
                </div>
                <div className="mt-10">
                    <div className="flex justify-center">
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                            onVerify={(token) => {
                                setToken(token);
                            }}
                        />
                    </div>
                    <Button 
                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground" 
                        disabled={!token}
                        onClick={handleVerify}
                    >
                        認証する
                    </Button>
                </div>
            </div>
        </main>
    )
}  

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Verify />
        </Suspense>
    )
}