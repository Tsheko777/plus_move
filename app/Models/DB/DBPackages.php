<?php

namespace App\Models\DB;

use Illuminate\Database\Eloquent\Model;

class DBPackages extends Model
{
    //
    protected $guarded = ['id', 'created_at', 'updated_at'];
    public $table = 'tbl_packages';
    public $timestamps = true;
}
