<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TrackingController extends Controller
{
    public function track($trackingNumber)
    {
        $package = DB::table('tbl_packages as p')
            ->join('tbl_deliveries as d', 'p.delivery_id', '=', 'd.id')
            ->join('tbl_orderCustomers as c', 'p.customer_id', '=', 'c.id')
            ->where('p.tracking_number', $trackingNumber)
            ->select(
                'p.tracking_number',
                'p.delivered_at',
                'd.status',
                'd.delivery_date',
                'c.name as customer_name',
                'c.email as customer_email',
                'c.city as customer_city'
            )
            ->first();

        if (!$package) {
            abort(404, 'Package not found');
        }

        return Inertia::render('track', [
            'tracking_number' => $package->tracking_number,
            'status' => $package->status ?? 'created',
            'delivered_at' => $package->delivered_at,
            'delivery_date' => $package->delivery_date,
            'customer' => [
                'name' => $package->customer_name,
                'email' => $package->customer_email,
                'city' => $package->customer_city,
            ],
        ]);
    }
}
