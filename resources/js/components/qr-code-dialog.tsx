import { Check, Copy, Download, ExternalLink, QrCode } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    spaceName: string;
}

export default function QrCodeDialog({ open, onOpenChange, url, spaceName }: Props) {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=12&data=${encodeURIComponent(
        url,
    )}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await fetch(qrImageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = `${spaceName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr-code.png`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(blobUrl);
        } catch {
            // Fallback: open in new tab
            window.open(qrImageUrl, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center sm:text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <QrCode className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl">Scan to Leave a Testimonial</DialogTitle>
                    <DialogDescription className="text-xs">
                        Customers can scan this code using their phone camera to instantly submit feedback for{' '}
                        <span className="font-semibold text-foreground">{spaceName}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-2">
                    {/* QR Code Container with High-Contrast Card */}
                    <div className="rounded-2xl border bg-white p-4 shadow-md dark:border-zinc-700">
                        <img
                            src={qrImageUrl}
                            alt={`QR Code for ${spaceName}`}
                            width={220}
                            height={220}
                            className="h-[220px] w-[220px] rounded-lg object-contain"
                            loading="lazy"
                        />
                    </div>

                    {/* Target Link */}
                    <div className="mt-4 flex w-full items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-xs">
                        <span className="font-mono text-muted-foreground truncate max-w-[280px]">{url}</span>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="ml-2 inline-flex items-center text-primary font-medium hover:underline"
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                    </div>

                    <p className="mt-2 text-center text-[11px] text-muted-foreground">
                        💡 Perfect for reception desks, event badges, printed receipts, flyers, and storefronts.
                    </p>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading}>
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        {downloading ? 'Downloading...' : 'Download PNG'}
                    </Button>

                    <Button size="sm" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                            Open Form
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
