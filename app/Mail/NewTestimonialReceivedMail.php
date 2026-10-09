<?php

namespace App\Mail;

use App\Models\Testimonial;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class NewTestimonialReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Testimonial $testimonial,
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $spaceName = $this->testimonial->space->name;

        return new Envelope(
            subject: "New Testimonial Received for {$spaceName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $space = $this->testimonial->space;
        $inboxUrl = route('spaces.inbox', $space);

        return new Content(
            view: 'mail.new-testimonial',
            with: [
                'spaceName' => $space->name,
                'respondentName' => $this->testimonial->name,
                'companyName' => $this->testimonial->company_name,
                'rating' => $this->testimonial->rating,
                'testimonialPreview' => Str::limit($this->testimonial->testimonial, 200),
                'inboxUrl' => $inboxUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
