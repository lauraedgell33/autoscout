<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'vin' => 'nullable|string|max:17|unique:vehicles,vin',
            'price' => 'required|numeric|min:0|max:9999999.99',
            'currency' => 'nullable|string|size:3',
            'description' => 'nullable|string|max:5000',
            'mileage' => 'nullable|integer|min:0',
            'fuel_type' => 'nullable|string|in:petrol,diesel,electric,hybrid,plugin_hybrid,lpg,cng,hydrogen',
            'transmission' => 'nullable|string|in:manual,automatic,semi_automatic',
            'color' => 'nullable|string|max:50',
            'doors' => 'nullable|integer|min:2|max:5',
            'seats' => 'nullable|integer|min:2|max:9',
            'body_type' => 'nullable|string|in:sedan,hatchback,suv,coupe,convertible,wagon,van,truck,minivan',
            'engine_size' => 'nullable|integer|min:0|max:10000',
            'power_hp' => 'nullable|integer|min:0|max:2000',
            'location_city' => 'nullable|string|max:255',
            'location_country' => 'nullable|string|size:2',
            'status' => 'nullable|in:draft,active,sold,reserved,removed',
        ];
    }

    public function messages(): array
    {
        return [
            'make.required' => 'Vehicle make is required',
            'model.required' => 'Vehicle model is required',
            'year.required' => 'Year is required',
            'year.min' => 'Year must be 1900 or later',
            'year.max' => 'Year cannot be in the future',
            'price.required' => 'Price is required',
            'price.min' => 'Price must be greater than 0',
            'vin.unique' => 'This VIN is already registered',
        ];
    }
}
