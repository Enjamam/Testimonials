<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Testimonial Received</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f5;
            color: #18181b;
            margin: 0;
            padding: 0;
            line-height: 1.5;
        }
        .wrapper {
            max-width: 580px;
            margin: 32px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e4e4e7;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 28px 32px;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.01em;
        }
        .header p {
            margin: 4px 0 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 32px;
        }
        .badge {
            display: inline-block;
            background-color: #e0e7ff;
            color: #4338ca;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
        }
        .author-info {
            margin-bottom: 20px;
        }
        .author-name {
            font-size: 16px;
            font-weight: 700;
            color: #09090b;
        }
        .author-meta {
            font-size: 13px;
            color: #71717a;
            margin-top: 2px;
        }
        .stars {
            color: #f59e0b;
            font-size: 16px;
            margin: 8px 0;
        }
        .quote-box {
            background-color: #f8fafc;
            border-left: 4px solid #6366f1;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
            font-size: 14px;
            color: #334155;
            font-style: italic;
            line-height: 1.6;
        }
        .cta-container {
            margin-top: 32px;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            padding: 12px 28px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }
        .footer {
            padding: 20px 32px;
            background-color: #fafafa;
            border-top: 1px solid #f4f4f5;
            text-align: center;
            font-size: 12px;
            color: #a1a1aa;
        }
        .footer a {
            color: #6366f1;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>New Testimonial Received</h1>
            <p>A new customer review was just submitted to your Space.</p>
        </div>

        <div class="content">
            <span class="badge">{{ $spaceName }}</span>

            <div class="author-info">
                <div class="author-name">{{ $respondentName }}</div>
                @if($companyName)
                    <div class="author-meta">{{ $companyName }}</div>
                @endif
            </div>

            @if($rating)
                <div class="stars">
                    @for($i = 0; $i < $rating; $i++)★@endfor
                </div>
            @endif

            <div class="quote-box">
                "{{ $testimonialPreview }}"
            </div>

            <div class="cta-container">
                <a href="{{ $inboxUrl }}" class="cta-button">
                    View in Space Inbox
                </a>
            </div>
        </div>

        <div class="footer">
            <p>You received this email because someone submitted a testimonial for <strong>{{ $spaceName }}</strong>.</p>
            <p>Direct inbox link: <a href="{{ $inboxUrl }}">{{ $inboxUrl }}</a></p>
        </div>
    </div>
</body>
</html>
