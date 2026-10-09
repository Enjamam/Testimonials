import { Link } from '@inertiajs/react';
import { Palette, Shield, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: User,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: Shield,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-8 max-w-5xl mx-auto">
            <div className="mb-6">
                <Heading
                    title="Account Settings"
                    description="Manage your profile information, security credentials, and application appearance"
                />
            </div>

            <Separator className="mb-8" />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full lg:w-56 shrink-0">
                    <nav
                        className="flex flex-col space-y-1 sticky top-6"
                        aria-label="Settings navigation"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const active = isCurrentOrParentUrl(item.href);
                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full justify-start gap-3 h-10 px-3 text-sm font-medium transition-all duration-200 rounded-lg',
                                        active
                                            ? 'bg-primary/10 text-primary font-semibold shadow-xs hover:bg-primary/15'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/70',
                                    )}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && (
                                            <item.icon className={cn('h-4 w-4 shrink-0 transition-colors', active ? 'text-primary' : 'text-muted-foreground')} />
                                        )}
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <main className="flex-1 min-w-0 max-w-2xl">
                    <div className="space-y-8 animate-in fade-in-50 duration-300 slide-in-from-bottom-1">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
