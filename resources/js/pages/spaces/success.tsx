import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Check, Copy, ExternalLink, LayoutDashboard, PartyPopper } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface SpaceData {
    id: number;
    name: string;
    title: string;
    slug: string;
    public_id: string;
    theme: string;
}

interface Props {
    space: SpaceData;
    publicUrl: string;
}

export default function SpaceSuccess({ space, publicUrl }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Spaces',
            href: '/spaces',
        },
        {
            title: space.name,
            href: `/spaces/${space.id}`,
        },
        {
            title: 'Created',
            href: `/spaces/${space.id}/success`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${space.name} Created Successfully`} />

            <div className="mx-auto flex h-full w-full max-w-2xl flex-1 flex-col items-center justify-center p-4 md:p-6 text-center">
                <Card className="w-full shadow-lg border-primary/20">
                    <CardHeader className="flex flex-col items-center pt-8 pb-4">
                        <div className="bg-primary/10 mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                            <PartyPopper className="text-primary h-8 w-8" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Space Created Successfully!</CardTitle>
                        <CardDescription className="max-w-md text-sm pt-1">
                            Your testimonial collection page for <span className="font-semibold text-foreground">{space.name}</span> is live and ready to receive customer feedback.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 px-6">
                        {/* Public Link Box */}
                        <div className="space-y-2 text-left">
                            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                                Public Collection URL
                            </span>
                            <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-2 sm:p-2.5">
                                <span className="flex-1 truncate font-mono text-xs sm:text-sm text-foreground">
                                    {publicUrl}
                                </span>
                                <Button
                                    size="sm"
                                    variant={copied ? 'default' : 'secondary'}
                                    onClick={handleCopy}
                                    className="shrink-0 gap-1.5"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-3.5 w-3.5" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5" />
                                            Copy Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-left text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">How it works:</p>
                            <ul className="mt-1.5 list-inside list-disc space-y-1">
                                <li>Share this link with your customers via email, SMS, or post-purchase thank you screens.</li>
                                <li>Customers can submit text testimonials, ratings, and optional photos without an account.</li>
                                <li>Incoming submissions arrive in your Space Inbox where you can curate your Wall of Love.</li>
                            </ul>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/10 p-6">
                        <Button variant="outline" asChild className="w-full sm:w-auto">
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                Return to Dashboard
                            </Link>
                        </Button>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button variant="secondary" asChild className="flex-1 sm:flex-none">
                                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-1.5 h-4 w-4" />
                                    Visit Public Page
                                </a>
                            </Button>

                            <Button asChild className="flex-1 sm:flex-none">
                                <Link href={`/spaces/${space.id}`}>
                                    Open Space
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
}
