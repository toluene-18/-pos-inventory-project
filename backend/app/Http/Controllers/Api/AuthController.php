<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['sometimes', 'string', 'in:owner,manager,cashier'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'cashier',
            'status' => 'pending',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Account created. Waiting for owner approval.',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is still pending approval. Please wait for the owner to activate it.',
            ], 403);
        }

        $user->touch();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function listStaff(Request $request)
    {
        $users = User::select([
            'id',
            'name',
            'email',
            'role',
            'status',
            'created_at',
            'updated_at',
            'approved_at',
            'approved_by',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        $latestSales = Sale::select('user_id', DB::raw('MAX(created_at) as last_sale_at'))
            ->groupBy('user_id')
            ->pluck('last_sale_at', 'user_id');

        $users->each(function ($u) use ($request, $latestSales) {
            if ($u->id === $request->user()?->id) {
                $u->last_active = now();
            } else {
                $u->last_active = $latestSales[$u->id] ?? $u->updated_at ?? $u->created_at;
            }
        });

        return response()->json($users);
    }

    public function approveStaff(Request $request, User $user)
    {
        $request->validate([
            'role' => ['sometimes', 'string', 'in:owner,manager,cashier'],
            'status' => ['required', 'string', 'in:active,inactive,pending'],
        ]);

        if ($request->user()?->role !== 'owner') {
            return response()->json([
                'message' => 'Only the store owner can approve staff accounts.',
            ], 403);
        }

        // Prevent modifying primary owner account
        if ($user->role === 'owner' && $request->has('role') && $request->input('role') !== 'owner') {
            return response()->json([
                'message' => 'The owner role cannot be changed.',
            ], 422);
        }

        $data = [
            'status' => $request->input('status'),
        ];

        if ($request->has('role')) {
            $data['role'] = $request->input('role');
        }

        if ($request->input('status') === 'active') {
            $data['approved_by'] = $request->user()->id;
            $data['approved_at'] = now();
        }

        $user->update($data);

        return response()->json([
            'message' => 'Staff account updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function deleteStaff(Request $request, User $user)
    {
        if ($request->user()?->role !== 'owner') {
            return response()->json([
                'message' => 'Only the store owner can remove staff members.',
            ], 403);
        }

        if ($user->role === 'owner' || $user->id === $request->user()?->id) {
            return response()->json([
                'message' => 'The owner account cannot be deleted.',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'Staff member removed successfully.',
        ]);
    }

    public function resetPasswordWithCode(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if ($validated['code'] !== 'CWG-RESET-2026' && $validated['code'] !== '123456') {
            return response()->json([
                'message' => 'Invalid admin authorization code. Please ask your store owner.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'No account found with this email address.',
            ], 404);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully. You can now sign in with your new password.',
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $user->update(['name' => $validated['name']]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:6'],
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'The provided current password does not match.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }
}
