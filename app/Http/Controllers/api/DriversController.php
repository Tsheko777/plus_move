<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DriversController extends Controller
{
    //
    public function Drivers()
    {
        $drivers = User::select(
            'tbl_users.id',
            'tbl_users.name',
            'tbl_users.email',
            'tbl_userInfo.phone',
            'tbl_userInfo.city',
            DB::raw('COUNT(tbl_deliveries.id) as deliveries_count'),
            DB::raw("SUM(CASE WHEN tbl_deliveries.status = 'delivered' THEN 1 ELSE 0 END) as deliveries_completed"),
            DB::raw("SUM(CASE WHEN tbl_deliveries.status = 'returned' THEN 1 ELSE 0 END) as returns_count"),
            DB::raw('MAX(tbl_deliveries.delivery_date) as last_delivery_date'),
            'tbl_users.created_at'
        )
            ->leftJoin('tbl_userInfo', 'tbl_users.id', '=', 'tbl_userInfo.user_id')
            ->leftJoin('tbl_deliveries', 'tbl_users.id', '=', 'tbl_deliveries.driver_id')
            ->where('tbl_users.role', 'driver')
            ->groupBy(
                'tbl_users.id',
                'tbl_users.name',
                'tbl_users.email',
                'tbl_users.created_at',
                'tbl_userInfo.phone',
                'tbl_userInfo.city'
            )
            ->paginate(15)
            ->withQueryString();

        return [
            'drivers' => $drivers,
            'summary' => $this->summary(),
        ];
    }
    public function SeachDriver($email)
    {
        $drivers = User::select(
            'tbl_users.id',
            'tbl_users.name',
            'tbl_users.email',
            'tbl_userInfo.phone',
            'tbl_userInfo.city',
            DB::raw('COUNT(tbl_deliveries.id) as deliveries_count'),
            DB::raw("SUM(CASE WHEN tbl_deliveries.status = 'delivered' THEN 1 ELSE 0 END) as deliveries_completed"),
            DB::raw("SUM(CASE WHEN tbl_deliveries.status = 'returned' THEN 1 ELSE 0 END) as returns_count"),
            DB::raw('MAX(tbl_deliveries.delivery_date) as last_delivery_date'),
            'tbl_users.created_at'
        )
            ->leftJoin('tbl_userInfo', 'tbl_users.id', '=', 'tbl_userInfo.user_id')
            ->leftJoin('tbl_deliveries', 'tbl_users.id', '=', 'tbl_deliveries.driver_id')
            ->where('tbl_users.role', 'driver')
            ->where('tbl_users.email', 'like', '%' . $email . '%')
            ->groupBy(
                'tbl_users.id',
                'tbl_users.name',
                'tbl_users.email',
                'tbl_users.created_at',
                'tbl_userInfo.phone',
                'tbl_userInfo.city'
            )
            ->paginate(15)
            ->withQueryString();

        return [
            'drivers' => $drivers,
            'summary' => $this->summary(),
        ];
    }

    public function summary()
    {
        return [
            'totalDrivers' => User::where('role', 'driver')->count(),
            'activeDrivers' => User::join('tbl_deliveries', 'tbl_deliveries.driver_id', 'tbl_users.id')
                ->where('tbl_users.role', 'driver')->count(),
            'totalDeliveries' => DB::table('tbl_deliveries')->where(['status' => 'delivered'])->count(),
            'totalReturns' => DB::table('tbl_deliveries')->where('status', 'returned')->count(),
        ];
    }
}
