<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
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
            'approved_at',
            'approved_by',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

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

        $data = [
            'status' => $request->input('status'),
        ];

        if ($request->has('role')) {
            $data['role'] = $request->input('role');
        }

        if ($request->input('status') === 'active' && ! $user->approved_at) {
            $data['approved_by'] = $request->user()->id;
            $data['approved_at'] = now();
        }

        $user->update($data);

        return response()->json([
            'message' => 'Staff account updated.',
            'user' => $user->fresh(),
        ]);
    }
}
