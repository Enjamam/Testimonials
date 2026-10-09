<?php

namespace App\Http\Requests;

use App\Models\Space;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Public submission endpoints do not require authentication.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Space|null $space */
        $space = $this->route('space');
        $fieldConfig = ($space instanceof Space && is_array($space->field_configuration))
            ? $space->field_configuration
            : Space::DEFAULT_FIELD_CONFIGURATION;

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'testimonial' => ['required', 'string', 'min:3', 'max:5000'],
            'consent_given' => ['required', 'accepted'],
            'website_hp' => ['nullable', 'string'],
        ];

        // Rating rule
        if ($space?->rating_enabled) {
            $rules['rating'] = ['required', 'integer', 'between:1,5'];
        } else {
            $rules['rating'] = ['nullable', 'integer', 'between:1,5'];
        }

        // Company Name rule
        $companyConfig = $fieldConfig['company_name'] ?? ['enabled' => false, 'required' => false];
        if (! empty($companyConfig['enabled']) && ! empty($companyConfig['required'])) {
            $rules['company_name'] = ['required', 'string', 'max:255'];
        } else {
            $rules['company_name'] = ['nullable', 'string', 'max:255'];
        }

        // Social URL rule
        $socialConfig = $fieldConfig['social_url'] ?? ['enabled' => false, 'required' => false];
        if (! empty($socialConfig['enabled']) && ! empty($socialConfig['required'])) {
            $rules['social_url'] = ['required', 'url:http,https', 'max:255'];
        } else {
            $rules['social_url'] = ['nullable', 'url:http,https', 'max:255'];
        }

        // Profile Photo rule
        $photoConfig = $fieldConfig['profile_photo'] ?? ['enabled' => false, 'required' => false];
        if (! empty($photoConfig['enabled']) && ! empty($photoConfig['required'])) {
            $rules['profile_photo'] = ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048', 'dimensions:max_width=4000,max_height=4000'];
        } else {
            $rules['profile_photo'] = ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048', 'dimensions:max_width=4000,max_height=4000'];
        }

        return $rules;
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'consent_given.accepted' => 'You must give permission to share your testimonial publicly.',
            'website_hp.max' => 'Spam detected.',
            'profile_photo.max' => 'The profile photo must not be greater than 2MB.',
            'profile_photo.uploaded' => 'The profile photo must not be greater than 2MB.',
            'profile_photo.mimes' => 'The profile photo must be a JPG, JPEG, PNG, or WebP image.',
        ];
    }
}
