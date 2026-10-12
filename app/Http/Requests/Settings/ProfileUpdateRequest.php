<?php

namespace App\Http\Requests\Settings;

use App\Concerns\ProfileValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    use ProfileValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->profileRules($this->user()->id);
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'avatar.uploaded' => __('The avatar image failed to upload. Please ensure the file is an image (JPG, PNG, WebP) under 2MB.'),
            'avatar.image' => __('The avatar must be an image file.'),
            'avatar.mimes' => __('The avatar must be a file of type: jpg, jpeg, png, webp.'),
            'avatar.max' => __('The avatar image may not be greater than 2MB.'),
        ];
    }
}
