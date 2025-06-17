<?php

namespace App\Http\Controllers\api;

use App\Helpers\NotificationEmailHelper;
use App\Http\Controllers\Controller;
use App\Logic\DeliveriesLogic;
use App\Models\DB\DBDeliveries;
use App\Models\DB\DBPackages;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DeliveriesController extends Controller
{
    /**
     * Get delivery summary
     *
     * This returns total deliveries, deliveries in transit, returned deliveries (this week), and recent deliveries.
     *
     * @group Deliveries
     * @response 200 {
     *   "total": 80,
     *   "intransit": 10,
     *   "returned": 5,
     *   "recentDeliveries": [
     *     {
     *       "tracking_number": "ABC123",
     *       "customer_name": "John Doe",
     *       "driver_name": "Jane Driver",
     *       "delivery_date": "2024-06-10",
     *       "status": "delivered"
     *     }
     *   ]
     * }
     */
    public function Deliveries($status = false): array
    {
        return [
            'total' => $this->getTotal(),
            'intransit' => $this->getIntransit(),
            'returned' => $this->getReturned(),
            'recentDeliveries' => $this->getRecentDeliveries($status),
        ];
    }

    /**
     * Update delivery status
     *
     * Use this to update a delivery status to one of: `in_transit`, `delivered`, `returned`, `created`, `shipped`.
     *
     * @group Deliveries
     * @bodyParam delivery_id int required The ID of the delivery. Example: 42
     * @bodyParam status string required The new status. Must be one of: in_transit, delivered, returned, created, shipped. Example: delivered
     * @response 200 {
     *   "message": "Delivery updated to delivered"
     * }
     */
    public function updateStatus(Request $request)
    {
        $request->validate([
            'delivery_id' => 'required|integer|',
            'status' => 'required|string|in:in_transit,delivered,returned,created,shipped'
        ]);
        $data = $request->input();
        $emailHelper = new NotificationEmailHelper();
        if ($data['status'] == 'delivered') {
            DBPackages::where('delivery_id', $data['delivery_id'])
                ->update(['delivered_at' => now()->format('Y-m-d H:i:s')]);
        }
        DBDeliveries::where('id', $data['delivery_id'])
            ->update(['status' => $data['status']]);

        $package = DBPackages::where(['delivery_id' => $data['delivery_id']])->first();
        $emailHelper->sendNotificationEmail($package['tracking_number']);

        return ['message' => 'Delivery updated to ' . $data['status']];
        ;
    }

    /**
     * Get package information
     *
     * Provide a tracking number to retrieve package and customer details.
     *
     * @group Deliveries
     * @bodyParam tracking_number string required The tracking number of the package. Example: ABC123
     * @response 200 {
     *   "tracking_number": "ABC123",
     *   "name": "John Doe",
     *   "weight": 5,
     *   "address": "123 Street, City",
     *   "description": "Fragile item"
     * }
     */
    public function packageInfomation(Request $request)
    {
        $request->validate(['tracking_number' => 'required']);
        $package = DBPackages::join('tbl_orderCustomers', 'tbl_orderCustomers.id', 'tbl_packages.customer_id')
            ->where(['tbl_packages.tracking_number' => $request->input('tracking_number')])
            ->first(['tbl_packages.tracking_number', 'tbl_orderCustomers.name', 'tbl_packages.weight', 'tbl_packages.address', 'tbl_packages.description']);
        return $package;
    }

    public function getTotal()
    {
        return DBDeliveries::count();
    }
    public function getIntransit()
    {
        return DBDeliveries::where('status', 'in_transit')
            ->count();
    }
    public function getReturned()
    {
        return DBDeliveries::where('status', '=', 'returned')
            ->whereBetween('updated_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->count();
    }

    public function getRecentDeliveries($status)
    {
        if ($status)
            return DBDeliveries::join('tbl_packages', 'tbl_packages.delivery_id', '=', 'tbl_deliveries.id')
                ->join('tbl_orderCustomers as customers', 'customers.id', '=', 'tbl_packages.customer_id')
                ->join('tbl_users as drivers', 'drivers.id', '=', 'tbl_deliveries.driver_id')
                ->where(['tbl_deliveries.status' => $status])
                ->select(
                    'tbl_deliveries.updated_at',
                    'tbl_packages.tracking_number',
                    'tbl_deliveries.status',
                    'tbl_deliveries.delivery_date',
                    'customers.name as customer_name',
                    'drivers.name as driver_name'
                )
                ->orderBy('tbl_deliveries.delivery_date', 'desc')
                ->paginate(15, ['tbl_deliveries.updated_at', 'tbl_packages.tracking_number', 'customer_name', 'driver_name', 'tbl_deliveries.delivery_date', 'tbl_deliveries.status']);

        return DBDeliveries::join('tbl_packages', 'tbl_packages.delivery_id', '=', 'tbl_deliveries.id')
            ->join('tbl_orderCustomers as customers', 'customers.id', '=', 'tbl_packages.customer_id')
            ->join('tbl_users as drivers', 'drivers.id', '=', 'tbl_deliveries.driver_id')
            ->select(
                'tbl_deliveries.updated_at',
                'tbl_packages.tracking_number',
                'tbl_deliveries.status',
                'tbl_deliveries.delivery_date',
                'customers.name as customer_name',
                'drivers.name as driver_name'
            )
            ->orderBy('tbl_deliveries.delivery_date', 'desc')
            ->paginate(15, );
    }

    public function createDelivery($date)
    {
        $driver = new PackagesController();
        $driver_id = $driver->freeDrivers()[0]['id'];
        if (!empty($driver)) {
            $delivery = DBDeliveries::create([
                'driver_id' => $driver_id,
                'status' => 'created',
                'delivery_date' => $date
            ]);
            return $delivery;
        }
        return response(['message' => 'Unable to create a new delivery please try again later'], 422);
    }

}