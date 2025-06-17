<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\DB\DBDeliveries;
use App\Models\DB\DBPackages;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Get dashboard summary
     *
     * This endpoint returns a summary of the dashboard including total deliveries, returns, active drivers, and recent deliveries.
     *
     * @response 200 {
     *   "totalDeliveries": 120,
     *   "currentReturns": 8,
     *   "activeDrivers": 5,
     *   "recentDeliveries": [
     *     {
     *       "tracking_number": "ABC123",
     *       "name": "Jane Doe",
     *       "status": "delivered",
     *       "delivered_at": "2024-06-09T12:34:56Z"
     *     }
     *   ]
     * }
     *
     * @group Dashboard
     */
    public function Dashboard(): array
    {
        return [
            'totalDeliveries' => $this->getTotalDeliveries(),
            'currentReturns' => $this->getTotalReturns(),
            'activeDrivers' => $this->getTotalDrivers(),
            'recentDeliveries' => $this->getRecentDeliveries(),
        ];
    }
    public function getTotalDeliveries(): int
    {
        return DBDeliveries::
            where('status', '=', 'delivered')
            ->count();
    }

    public function getTotalDrivers()
    {
        return User::where('role', '=', 'driver')
            ->count();
    }

    public function getTotalReturns()
    {
        return DBDeliveries::where('status', '=', 'returned')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
    }

    public function getRecentDeliveries()
    {
        return DBDeliveries::join('tbl_packages', 'tbl_packages.delivery_id', '=', 'tbl_deliveries.id')
            ->join('tbl_users', 'tbl_users.id', '=', 'tbl_deliveries.driver_id')
            ->join('tbl_orderCustomers', 'tbl_orderCustomers.id', '=', 'tbl_packages.customer_id')
            ->select(['tbl_deliveries.delivery_date', 'tbl_users.name as driver', 'tbl_packages.tracking_number', 'tbl_orderCustomers.name', 'tbl_deliveries.status', 'tbl_packages.delivered_at'])
            ->orderBy('tbl_packages.delivered_at', 'desc')
            ->paginate(15);
    }
}