<?php

namespace App\Http\Controllers;

use App\Models\EmbedConfiguration;
use App\Models\Space;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicEmbedController extends Controller
{
    /**
     * Render the standalone public embed wall for a given Space.
     * This endpoint is public and isolated from the authenticated application layout.
     */
    public function show(Request $request, Space $space): Response|JsonResponse
    {
        /** @var EmbedConfiguration $config */
        $config = $space->embedConfiguration ?? new EmbedConfiguration([
            'layout' => 'masonry',
            'dark_mode' => false,
            'animation_enabled' => true,
            'background_color' => '#ffffff',
            'item_limit' => 20,
            'display_options' => EmbedConfiguration::DEFAULT_DISPLAY_OPTIONS,
        ]);

        $displayOptions = $config->display_options ?? EmbedConfiguration::DEFAULT_DISPLAY_OPTIONS;

        // Query strictly eligible testimonials.
        // SECURITY INVARIANT: email is excluded, unconsented/hidden/deleted are excluded!
        $testimonials = $space->testimonials()
            ->publicWallOfLove()
            ->orderByDesc('is_favorite')
            ->orderByDesc('submitted_at')
            ->orderByDesc('created_at')
            ->take($config->item_limit)
            ->get([
                'id',
                'name',
                'company_name',
                'social_url',
                'profile_photo_path',
                'testimonial',
                'rating',
                'created_at',
            ])
            ->map(function ($item) use ($displayOptions, $space): array {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'company_name' => (! empty($displayOptions['show_company_name'])) ? $item->company_name : null,
                    'social_url' => $item->social_url,
                    'profile_photo_path' => (! empty($displayOptions['show_profile_photo'])) ? $item->profile_photo_path : null,
                    'testimonial' => $item->testimonial,
                    'rating' => ($space->rating_enabled && ! empty($displayOptions['show_rating'])) ? $item->rating : null,
                    'created_at' => $item->created_at?->toISOString(),
                ];
            });

        if ($request->wantsJson() || $request->query('format') === 'json') {
            return response()->json([
                'space' => [
                    'public_id' => $space->public_id,
                    'title' => $space->title,
                    'rating_enabled' => (bool) $space->rating_enabled,
                ],
                'config' => [
                    'layout' => $config->layout,
                    'dark_mode' => (bool) $config->dark_mode,
                    'animation_enabled' => (bool) $config->animation_enabled,
                    'background_color' => $config->background_color,
                    'item_limit' => $config->item_limit,
                    'display_options' => $displayOptions,
                ],
                'testimonials' => $testimonials,
            ]);
        }

        return Inertia::render('embed/wall', [
            'space' => [
                'public_id' => $space->public_id,
                'title' => $space->title,
                'rating_enabled' => (bool) $space->rating_enabled,
            ],
            'config' => [
                'layout' => $config->layout,
                'dark_mode' => (bool) $config->dark_mode,
                'animation_enabled' => (bool) $config->animation_enabled,
                'background_color' => $config->background_color,
                'item_limit' => $config->item_limit,
                'display_options' => $displayOptions,
            ],
            'testimonials' => $testimonials,
        ]);
    }
}
