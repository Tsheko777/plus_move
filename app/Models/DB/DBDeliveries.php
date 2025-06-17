<?php

namespace App\Models\DB;

use Illuminate\Database\Eloquent\Model;

class DBDeliveries extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];
    public $table = 'tbl_deliveries';
    public $timestamps = true;
}
