<?php

namespace App\Models\DB;

use Illuminate\Database\Eloquent\Model;

class DBReports extends Model
{
    //
    protected $guarded = ['id', 'created_at', 'updated_at'];
    public $table = 'tbl_reports';
    public $timestamps = true;
}
