<?php

namespace App\Http\Controllers\api;

use App\Helpers\NotificationEmailHelper;
use App\Http\Controllers\Controller;
use App\Logic\DeliveriesLogic;
use App\Logic\PackagesLogic;
use App\Models\DB\DBDeliveries;
use App\Models\DB\DBOrderCustomers;
use App\Models\DB\DBPackages;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PackagesController extends Controller
{

    /**
     * Get package statistics and free drivers.
     * 
     * @group Packages
     * 
     * @response {
     *   "total": 100,
     *   "delivered": 80,
     *   "pending": 20,
     *   "recentPending": [
     *     {
     *       "created_at": "2025-06-01T12:00:00Z",
     *       "delivered_at": null,
     *       "weight": 1.2,
     *       "tracking_number": "PKG123456",
     *       "name": "John Doe",
     *       "status": "created",
     *       "delivery_created_at": "2025-06-01T10:00:00Z"
     *     }
     *   ],
     *   "freeDrivers": [
     *     {
     *       "id": 5,
     *       "deliveries": 0
     *     }
     *   ]
     * }
     */
    public function Packages($status = false)
    {
        return [
            'total' => $this->getPackages(),
            'delivered' => $this->getDelivered(),
            'pending' => $this->getPendng(),
            'recentPending' => $this->getRecentPackages($status),
            'freeDrivers' => $this->freeDrivers(),
        ];
    }
    public function getPackages()
    {
        return DBPackages::count();
    }

    public function getDelivered()
    {
        return DBPackages::join('tbl_deliveries', 'tbl_deliveries.id', 'tbl_packages.delivery_id')
            ->where('tbl_deliveries.status', 'delivered')
            ->count();
    }
    public function getPendng()
    {
        return DBPackages::
            join('tbl_deliveries', 'tbl_deliveries.id', 'tbl_packages.delivery_id')
            ->where('tbl_deliveries.status', 'created')
            ->count();
    }
    public function getRecentPackages($status)
    {
        if ($status)
            return DBPackages::join('tbl_orderCustomers', 'tbl_orderCustomers.id', '=', 'tbl_packages.customer_id')
                ->join('tbl_deliveries', 'tbl_deliveries.id', '=', 'tbl_packages.delivery_id')
                ->where(['tbl_deliveries.status' => $status])
                ->orderBy("tbl_packages.created_at", "desc")
                ->paginate(15, ['tbl_deliveries.created_at', 'tbl_packages.delivered_at', 'tbl_packages.weight', 'tbl_packages.tracking_number', 'tbl_orderCustomers.name', 'tbl_deliveries.status', 'tbl_packages.created_at']);

        return DBPackages::join('tbl_orderCustomers', 'tbl_orderCustomers.id', '=', 'tbl_packages.customer_id')
            ->join('tbl_deliveries', 'tbl_deliveries.id', '=', 'tbl_packages.delivery_id')
            ->orderBy("tbl_packages.created_at", "desc")
            ->paginate(15, ['tbl_deliveries.created_at', 'tbl_packages.delivered_at', 'tbl_packages.weight', 'tbl_packages.tracking_number', 'tbl_orderCustomers.name', 'tbl_deliveries.status', 'tbl_packages.created_at']);
    }

    /**
     * Create a new package.
     * 
     * @group Packages
     * 
     * @bodyParam customer string required Customer name. Example: John Doe
     * @bodyParam weight number required Package weight in kg. Example: 2.5
     * @bodyParam address string required Customer address. Example: 123 Main St
     * @bodyParam date string required Delivery date (Y-m-d). Example: 2025-06-10
     * @bodyParam city string required Customer city. Example: New York
     * @bodyParam description string required Package description. Example: Fragile glassware
     * @bodyParam phone string required Customer phone number, 10 digits starting with 0. Example: 0123456789
     * 
     * @response 200 {
     *   "message": "New package has been created PKG123456"
     * }
     * @response 422 {
     *   "message": "Failed to create package"
     * }
     */
    public function createPackage(Request $request)
    {
        $request->validate([
            'customer' => 'required|string|max:255',
            'weight' => 'required|numeric|min:0',
            'address' => 'required',
            'date' => 'required|date_format:Y-m-d',
            'city' => 'required',
            'email' => 'required|email',
            'description' => 'required',
            'phone' => [
                'required',
                'regex:/^0[0-9]{9}$/'
            ],
            [
                'phone.regex' => 'Phone number must be exactly 10 digits and start with 0.',
            ]
        ]);
        $deliveryLogic = new DeliveriesController();
        $delivery = $deliveryLogic->createDelivery($request->input("date"));
        if (!empty($delivery)) {
            $data = $request->input();
            $customer = DBOrderCustomers::create([
                'name' => $data['customer'],
                'email' => $data['email'],
                'city' => $data['city'],
                'phone' => $data['phone'],
                'address' => $data['address'],
            ]);
            if (!empty($customer)) {
                $package = DBPackages::create([
                    'delivery_id' => $delivery['id'],
                    'customer_id' => $customer['id'],
                    'tracking_number' => $this->trackingNumber(),
                    'description' => $data['description'],
                    'weight' => $data['weight'],
                    'address' => $data['address'],
                    'status' => 'created',
                ]);
                $emailHelper = new NotificationEmailHelper();
                $emailHelper->sendNotificationEmail($package['tracking_number']);
                return ['message' => 'New package has been created ' . $package['tracking_number']];
            }
            return response()->json(['message' => 'Failed to create package'], 422);
        }
        return response(['message' => 'Unable to create a new package please try again later'], 422);
    }

    /**
     * Delete a package by tracking number.
     * 
     * @group Packages
     * 
     * @bodyParam tracking_number string required Package tracking number. Example: PKG123456
     * 
     * @response 200 {
     *   "message": "Package with tracking number PKG123456 has been deleted"
     * }
     * @response 422 {
     *   "message": "Package not found"
     * }
     */
    public function deletePackage(Request $request)
    {
        $request->validate([
            'tracking_number' => 'required',
        ]);
        $package = DBPackages::where('tracking_number', $request->input('tracking_number'))->first();
        if ($package) {
            $package->delete();
            return ['message' => 'Package with tracking number ' . $request->input('tracking_number') . ' has been deleted'];
        }
        return response()->json(['message' => 'Package not found'], 422);
    }

    /**
     * Get delivery information for a package.
     * 
     * @group Packages
     * 
     * @bodyParam tracking_number string required Package tracking number. Example: PKG123456
     * 
     * @response 200 {
     *   "customer": "John Doe",
     *   "driver": "Jane Smith",
     *   "date": "2025-06-01"
     * }
     */

    public function deliveryInfomation(Request $request)
    {
        $request->validate([
            'tracking_number' => 'required',
        ]);
        $package = DBDeliveries::join('tbl_packages', 'tbl_packages.delivery_id', 'tbl_deliveries.id')
            ->join('tbl_users', 'tbl_users.id', 'tbl_deliveries.driver_id')
            ->join('tbl_orderCustomers', 'tbl_orderCustomers.id', 'tbl_packages.customer_id')
            ->select(['tbl_orderCustomers.name as customer', 'tbl_users.name as driver', 'tbl_deliveries.delivery_date as date'])
            ->where(['tbl_packages.tracking_number' => $request->input('tracking_number')])
            ->first();
        return $package;
    }
    public function freeDrivers()
    {
        $freeDrivers = User::where('role', 'driver')
            ->leftJoin('tbl_deliveries', 'tbl_deliveries.driver_id', '=', 'tbl_users.id')
            ->select('tbl_users.id', DB::raw('COUNT(tbl_deliveries.id) as deliveries'))
            ->groupBy('tbl_users.id')
            ->orderBy('deliveries', 'asc')
            ->get();
        return $freeDrivers;
    }
    public function trackingNumber()
    {
        $trackingNumber = "";
        while ($trackingNumber == "") {
            $generatedPackage = "PKG" . rand(100000, 999999);
            $packages = DBPackages::where('tracking_number', '=', $generatedPackage)->count();
            if ($packages == 0)
                $trackingNumber = $generatedPackage;
        }
        return $trackingNumber;
    }
}