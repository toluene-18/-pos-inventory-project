<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Account lifecycle: pending (self-registered, awaiting owner) → active,
 * or rejected; active ↔ inactive when the owner deactivates staff.
 * Existing users default to active so nobody is locked out.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->after('role')->index();
            $table->foreignId('approved_by')->nullable()->after('status')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('approved_by');
            $table->dropColumn(['status', 'approved_at']);
        });
    }
};
