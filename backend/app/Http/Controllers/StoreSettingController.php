<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StoreSettingController extends Controller
{
    public function show()
    {
        $setting = DB::table('store_settings')->where('key', 'store_profile')->first();
        if (!$setting) {
            return response()->json([
                'name' => 'CWG Provisions Store',
                'state' => 'Ogun State',
                'city' => 'Abeokuta',
                'address' => '12 Ogui Road, by Amaechi Junction',
                'country' => 'Nigeria',
            ]);
        }

        return response()->json(json_decode($setting->value, true) ?: []);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'openingHours' => 'nullable|string|max:255',
        ]);

        $existing = DB::table('store_settings')->where('key', 'store_profile')->first();
        $merged = $existing ? array_merge(json_decode($existing->value, true) ?: [], $validated) : $validated;

        DB::table('store_settings')->updateOrInsert(
            ['key' => 'store_profile'],
            ['value' => json_encode($merged), 'updated_at' => now(), 'created_at' => now()]
        );

        return response()->json([
            'message' => 'Store settings updated successfully.',
            'settings' => $merged,
        ]);
    }
}
