import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <div className="flex items-center gap-2.5">
            <div className="relative flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg shadow-sm shadow-emerald-500/20 ring-1 ring-white/10 overflow-hidden">
                <AppLogoIcon className="size-8" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                    {name ?? 'Testimonials'}
                </span>
                <span className="text-[11px] text-muted-foreground truncate font-normal">
                    Social Proof Platform
                </span>
            </div>
        </div>
    );
}
