<?php

use App\Models\Pasien;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pemeriksaan', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Pasien::class, 'pasien_id')
                ->constrained('pasien')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('perawat_id')->nullable()
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('dokter_id')->nullable()
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->float('berat_badan')->nullable();
            $table->string('tekanan_darah')->nullable();
            $table->text('keluhan')->nullable();
            $table->text('diagnosa')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemeriksaan');
    }
};
