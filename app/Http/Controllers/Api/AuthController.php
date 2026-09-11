<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FAQRCode\Google2FA;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'otp' => ['nullable', 'string'],
        ]);

        if (! Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ])) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();
        $google2fa = new Google2FA();

        $secret = null;

        if ($user->two_factor_secret) {
            try {
                $secret = decrypt($user->two_factor_secret);
            } catch (\Throwable $e) {
                $secret = null;
            }
        }

        if (! $secret) {
            $secret = $google2fa->generateSecretKey();
            $user->two_factor_secret = encrypt($secret);
            $user->two_factor_enabled = false;
            $user->save();
        }

        if (! $user->two_factor_enabled) {
            if (empty($credentials['otp'])) {
                $qrCode = trim((string) $google2fa->getQRCodeInline(
                    'DLSJBC PPES',
                    $user->email,
                    $secret,
                    240
                ));

                if (! str_starts_with($qrCode, 'data:image/')) {
                    if (preg_match('/<svg|<\?xml/i', $qrCode)) {
                        $qrCode = 'data:image/svg+xml;base64,' . base64_encode($qrCode);
                    } else {
                        $qrCode = 'data:image/png;base64,' . base64_encode($qrCode);
                    }
                }

                return response()->json([
                    'requires_otp_setup' => true,
                    'qr_code' => $qrCode,
                    'message' => 'Scan the QR code with your authenticator app, then enter the 6-digit code to complete sign in.',
                ]);
            }

            if (! $google2fa->verifyKey($secret, $credentials['otp'])) {
                throw ValidationException::withMessages([
                    'otp' => ['The authenticator code is invalid.'],
                ]);
            }

            $user->two_factor_enabled = true;
            $user->save();
        }

        if (empty($credentials['otp']) && $user->two_factor_enabled) {
            return response()->json([
                'requires_otp' => true,
                'message' => 'Enter the 6-digit code from your authenticator app.',
            ]);
        }

        if (! empty($credentials['otp']) && $user->two_factor_enabled) {
            $storedSecret = $user->two_factor_secret;
            try {
                $secret = decrypt($storedSecret);
            } catch (\Throwable $e) {
                $secret = $storedSecret;
            }

            if (! $google2fa->verifyKey($secret, $credentials['otp'])) {
                throw ValidationException::withMessages([
                    'otp' => ['The authenticator code is invalid.'],
                ]);
            }
        }

        $token = $user->createToken('ppes-web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'position' => $user->position,
                'two_factor_enabled' => (bool) $user->two_factor_enabled,
            ],
        ]);
    }

    public function disableTwoFactor(Request $request)
    {
        $validated = $request->validate([
            'password' => ['required'],
            'otp' => ['nullable', 'string'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if (! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['The provided password is incorrect.'],
            ]);
        }

        if ($user->two_factor_enabled) {
            if (empty($validated['otp'])) {
                return response()->json([
                    'requires_otp' => true,
                    'message' => 'Enter the current 6-digit code from your authenticator app to disable 2FA.',
                ], 422);
            }

            $storedSecret = $user->two_factor_secret;
            try {
                $secret = decrypt($storedSecret);
            } catch (\Throwable $e) {
                $secret = $storedSecret;
            }

            $google2fa = new Google2FA();

            if (! $google2fa->verifyKey($secret, $validated['otp'])) {
                throw ValidationException::withMessages([
                    'otp' => ['The authenticator code is invalid.'],
                ]);
            }
        }

        $user->two_factor_enabled = false;
        $user->two_factor_secret = null;
        $user->save();

        return response()->json([
            'message' => 'Two-factor authentication has been disabled.',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'position' => $user->position,
            'two_factor_enabled' => (bool) $user->two_factor_enabled,
        ]);
    }
}
