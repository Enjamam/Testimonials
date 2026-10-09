import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Code2,
    Copy,
    ExternalLink,
    Heart,
    Inbox,
    MessageSquare,
    Settings,
    Star,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface SpaceData {
    id: number;
    name: string;
    title: string;
    subtitle: string | null;
    ask: string | null;
    slug: string;
    public_id: string;
    theme: string;
    rating_enabled: boolean;
    testimonials_count: number;
    wall_of_love_count: number;
    created_at: string;
}

interface Props {
    space: SpaceData;
    publicUrl: string;
}

export default function SpaceShow({ space, publicUrl }: Props) {
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

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${space.name}"? This action will permanently delete all associated testimonials and embed settings.`)) {
            router.delete(`/spaces/${space.id}`);
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
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={space.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/spaces">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{space.name}</h1>
                                <Badge variant="outline" className="capitalize text-xs">
                                    {space.theme.replace('-', ' ')}
                                </Badge>
                                {space.rating_enabled && (
                                    <Badge variant="secondary" className="text-xs">
                                        ★ Rating Active
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground mt-0.5 text-sm">{space.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/spaces/${space.id}/edit`}>
                                <Settings className="mr-1.5 h-3.5 w-3.5" />
                                Settings
                            </Link>
                        </Button>

                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Public Link Card */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                        <div className="space-y-0.5">
                            <span className="text-xs font-semibold uppercase text-primary tracking-wider">
                                Public Collection Page
                            </span>
                            <div className="font-mono text-sm text-foreground truncate max-w-lg">
                                {publicUrl}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button size="sm" variant={copied ? 'default' : 'secondary'} onClick={handleCopy}>
                                {copied ? (
                                    <>
                                        <Check className="mr-1.5 h-3.5 w-3.5" />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                                        Copy Link
                                    </>
                                )}
                            </Button>

                            <Button size="sm" asChild>
                                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                    Visit
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{space.testimonials_count}</div>
                            <p className="text-muted-foreground text-xs">Total customer submissions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Wall of Love</CardTitle>
                            <Heart className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{space.wall_of_love_count ?? 0}</div>
                            <p className="text-muted-foreground text-xs">Published public testimonials</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Collection URL</CardTitle>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono text-base truncate">
                                /s/{space.public_id}
                            </div>
                            <p className="text-muted-foreground text-xs">Direct public access code</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Feature Hub Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Inbox className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base">Testimonial Inbox</CardTitle>
                            </div>
                            <CardDescription>
                                Review incoming testimonials, toggle favorites, approve for the Wall of Love, or hide submissions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href={`/spaces/${space.id}/inbox`}>
                                    Open Inbox ({space.testimonials_count})
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col justify-between">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base">Embed Builder</CardTitle>
                            </div>
                            <CardDescription>
                                Configure Masonry or Carousel widgets, customize colors, and grab copyable HTML embed codes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button variant="secondary" className="w-full" asChild>
                                <Link href={`/spaces/${space.id}/embed`}>
                                    Configure Embeds
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
