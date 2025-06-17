<?php

namespace App\Models\DB;

use Illuminate\Database\Eloquent\Model;

class DBOrderCustomers extends Model
{
    //
    protected $guarded = ['id', 'created_at', 'updated_at'];
    public $table = 'tbl_orderCustomers';
    public $timestamps = true;
}
