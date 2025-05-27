<?php

use App\Models\Obat;
use App\Models\Pemeriksaan;
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
        Schema::create('pemberian_obat', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Pemeriksaan::class, 'pemeriksaan_id')
                ->constrained('pemeriksaan')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->foreignIdFor(Obat::class, 'obat_id')
                ->constrained('obat')
                ->restrictOnDelete()
                ->cascadeOnUpdate();
            $table->float('harga');
            $table->integer('jumlah')->default(0);
            $table->float('total')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemberian_obat');
    }
};
