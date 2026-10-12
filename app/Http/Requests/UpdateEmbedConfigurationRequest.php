<?php

namespace App\Http\Requests;

use App\Models\EmbedConfiguration;
use App\Models\Space;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmbedConfigurationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Space|null $space */
        $space = $this->route('space');

        return $space !== null && $this->user()?->can('update', $space);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'layout' => ['required', 'string', Rule::in(EmbedConfiguration::LAYOUTS)],
            'dark_mode' => ['required', 'boolean'],
            'animation_enabled' => ['required', 'boolean'],
            'background_color' => ['nullable', 'string', 'max:25'],
            'item_limit' => ['required', 'integer', 'between:1,50'],
            'display_options' => ['required', 'array'],
            'display_options.show_rating' => ['required', 'boolean'],
            'display_options.show_profile_photo' => ['required', 'boolean'],
            'display_options.show_company_name' => ['required', 'boolean'],
            'display_options.min_rating' => ['nullable', 'integer', 'between:0,5'],
            'display_options.card_radius' => ['nullable', 'string', 'max:50'],
            'display_options.card_shadow' => ['nullable', 'string', 'max:50'],
        ];
    }
}
