<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_reports', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('generated_by')->nullable();
            $table->integer('total_deliveries')->default(0);
            $table->integer('total_returns')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_reports');
    }
};
