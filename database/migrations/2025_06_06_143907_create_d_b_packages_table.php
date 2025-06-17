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
        Schema::create('tbl_packages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('delivery_id');
            $table->unsignedBigInteger('customer_id');
            $table->string('tracking_number')->unique();
            $table->text('description')->nullable();
            $table->float('weight')->nullable();
            $table->string('address');
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            $table->foreign('delivery_id')->references('id')->on('tbl_deliveries')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('tbl_orderCustomers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_packages');
    }
};
