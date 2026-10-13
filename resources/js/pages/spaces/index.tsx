import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, ExternalLink, Layers, MessageSquare, Plus, Settings2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface SpaceItem {
    id: number;
    name: string;
    title: string;
    subtitle: string | null;
    slug: string;
    public_id: string;
    theme: string;
    rating_enabled: boolean;
    testimonials_count: number;
    created_at: string;
}

interface UsageInfo {
    current: number;
    max: number;
    remaining: number;
    can_create: boolean;
    is_pro: boolean;
}

interface Props {
    spaces: SpaceItem[];
    usage: UsageInfo;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Spaces',
        href: '/spaces',
    },
];

export default function SpacesIndex({ spaces, usage }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Spaces" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Spaces</h1>
                            <Badge variant={usage.is_pro ? 'default' : 'secondary'}>
                                {usage.is_pro ? 'Pro Plan' : 'Free Plan'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage your testimonial collection spaces and embed forms.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-muted-foreground text-xs sm:text-sm">
                            <span className="font-semibold text-foreground">{usage.current}</span> of{' '}
                            <span className="font-semibold text-foreground">{usage.max}</span> spaces used
                        </div>
                        {usage.can_create ? (
                            <Button asChild>
                                <Link href="/spaces/create">
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    New Space
                                </Link>
                            </Button>
                        ) : (
                            <Button disabled title="Space limit reached">
                                <Plus className="mr-1.5 h-4 w-4" />
                                Limit Reached
                            </Button>
                        )}
                    </div>
                </div>

                {/* Plan limit warning banner when at capacity on Free */}
                {!usage.can_create && !usage.is_pro && (
                    <div className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="text-sm">
                                <span className="font-semibold">Free tier limit reached ({usage.max} spaces).</span>{' '}
                                Upgrade to Pro to create up to 25 spaces and collect up to 1,000 testimonials each.
                            </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-900/40" asChild>
                            <Link href="/billing">Upgrade to Pro</Link>
                        </Button>
                    </div>
                )}

                {/* Spaces Grid or Empty State */}
                {spaces.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
                            <Layers className="text-primary h-7 w-7" />
                        </div>
                        <CardHeader className="p-0 pt-4">
                            <CardTitle className="text-xl">No spaces created yet</CardTitle>
                            <CardDescription className="max-w-sm pt-1">
                                A Space is your dedicated collection page where your clients submit testimonials. Create your first Space in seconds!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 pt-6">
                            <Button asChild>
                                <Link href="/spaces/create">
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    Create Your First Space
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {spaces.map((space) => (
                            <Card key={space.id} className="flex flex-col justify-between transition-shadow hover:shadow-md">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="text-lg font-semibold truncate flex-1 min-w-0" title={space.name}>
                                            <Link href={`/spaces/${space.id}`} className="hover:underline">
                                                {space.name}
                                            </Link>
                                        </CardTitle>
                                        <Badge variant="outline" className="capitalize shrink-0 text-xs">
                                            {space.theme.replace('-', ' ')}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {space.title}
                                    </CardDescription>
                                </CardHeader>


                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{space.testimonials_count} {space.testimonials_count === 1 ? 'testimonial' : 'testimonials'}</span>
                                        </div>
                                        {space.rating_enabled && (
                                            <Badge variant="secondary" className="text-xs">
                                                ★ Ratings
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between rounded-md bg-muted/60 px-2.5 py-1.5 text-xs font-mono text-muted-foreground">
                                        <span className="truncate">/s/{space.slug || space.public_id}</span>
                                        <a
                                            href={`/s/${space.slug || space.public_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 inline-flex items-center gap-1 font-sans text-xs text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                                            title="View Public Collection Form"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Form
                                        </a>
                                    </div>
                                </CardContent>

                                <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/20 p-3">
                                    <Button variant="outline" size="sm" asChild className="w-full">
                                        <Link href={`/spaces/${space.id}/edit`}>
                                            <Settings2 className="mr-1.5 h-3.5 w-3.5" />
                                            Settings
                                        </Link>
                                    </Button>

                                    <Button size="sm" asChild className="w-full">
                                        <Link href={`/spaces/${space.id}`}>
                                            Manage
                                            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
