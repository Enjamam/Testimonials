<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateEmbedConfigurationRequest;
use App\Models\EmbedConfiguration;
use App\Models\Space;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EmbedController extends Controller
{
    /**
     * Show the embed builder and configuration studio for the given space.
     */
    public function show(Request $request, Space $space): Response
    {
        Gate::authorize('view', $space);

        /** @var EmbedConfiguration $config */
        $config = $space->embedConfiguration ?? $space->embedConfiguration()->create([
            'layout' => 'masonry',
            'dark_mode' => false,
            'animation_enabled' => true,
            'background_color' => '#ffffff',
            'item_limit' => 20,
            'display_options' => EmbedConfiguration::DEFAULT_DISPLAY_OPTIONS,
        ]);

        // Fetch eligible public testimonials for live builder preview (Email excluded!)
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
            ]);

        $embedUrl = url('/embed/'.$space->public_id);
        $embedSnippet = '<iframe src="'.$embedUrl.'" width="100%" height="650" frameborder="0" loading="lazy"></iframe>';

        return Inertia::render('spaces/embed', [
            'space' => $space,
            'config' => $config,
            'testimonials' => $testimonials,
            'embedUrl' => $embedUrl,
            'embedSnippet' => $embedSnippet,
        ]);
    }

    /**
     * Update the embed configuration for the space.
     */
    public function update(UpdateEmbedConfigurationRequest $request, Space $space): RedirectResponse
    {
        $space->embedConfiguration()->updateOrCreate(
            ['space_id' => $space->id],
            $request->validated()
        );

        return back()->with('success', 'Embed settings updated successfully.');
    }
}
