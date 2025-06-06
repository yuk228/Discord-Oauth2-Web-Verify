"use client";

import { Turnstile } from "next-turnstile";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Verify() {
    const [token, setToken] = useState<string | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const res = await fetch("/api/csrf", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch CSRF token");
                }
                const data = await res.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error("Error fetching CSRF token:", error);
                router.push("/error");
            }
        };
        fetchCsrfToken();
    }, [router]);

    const handleVerify = async () => {
        if (!token || !csrfToken) return;
        try {
            console.log("Sending verify request...");
            const res = await fetch("/api/verify", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken,
                },
                body: JSON.stringify({
                    token,
                }),
            });

            const result = await res.json();

            if (result.status === 200) {
                router.push("/success");
            } else {
                router.push("/error");
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            router.push("/error");
        }
    };

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
                        disabled={!token || !csrfToken}
                        onClick={handleVerify}
                    >
                        認証する
                    </Button>
                </div>
            </div>
        </main>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Verify />
        </Suspense>
    );
}
