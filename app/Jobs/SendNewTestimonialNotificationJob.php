<?php

namespace App\Jobs;

use App\Mail\NewTestimonialReceivedMail;
use App\Models\Testimonial;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendNewTestimonialNotificationJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var array<int, int>
     */
    public array $backoff = [10, 30, 60];

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Testimonial $testimonial,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $space = $this->testimonial->relationLoaded('space')
            ? $this->testimonial->space
            : $this->testimonial->space()->first();

        if (! $space) {
            Log::warning('Skipping new testimonial notification: space relation missing', [
                'testimonial_id' => $this->testimonial->id,
            ]);

            return;
        }

        $owner = $space->relationLoaded('user')
            ? $space->user
            : $space->user()->first();

        if (! $owner || empty($owner->email)) {
            Log::warning('Skipping new testimonial notification: space owner email missing', [
                'space_id' => $space->id,
                'testimonial_id' => $this->testimonial->id,
            ]);

            return;
        }

        Mail::to($owner->email)->send(new NewTestimonialReceivedMail($this->testimonial));

        Log::info('New testimonial notification email sent successfully', [
            'owner_email' => $owner->email,
            'space_id' => $space->id,
            'testimonial_id' => $this->testimonial->id,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(?Throwable $exception): void
    {
        Log::error('Failed to send new testimonial notification email after max attempts', [
            'testimonial_id' => $this->testimonial->id,
            'error' => $exception?->getMessage(),
        ]);
    }
}
