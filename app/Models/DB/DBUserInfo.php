<?php

namespace App\Models\DB;

use Illuminate\Database\Eloquent\Model;

class DBUserInfo extends Model
{
    //
    protected $guarded = ['id', 'created_at', 'updated_at'];
    public $table = 'tbl_userInfo';
    public $timestamps = true;
}
