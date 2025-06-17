<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Mail;
use App\Mail\OrderStatusUpdated;
use App\Models\DB\DBPackages;

class NotificationEmailHelper
{
    public function sendNotificationEmail($tracking_number)
    {
        $email = $this->getOrderDetails($tracking_number)['email'];
        $name = $this->getOrderDetails($tracking_number)['name'];
        $delivery_date = $this->getOrderDetails($tracking_number)['delivery_date'];
        $address = $this->getOrderDetails($tracking_number)['address'];
        $status = $this->getOrderDetails($tracking_number)['status'];
        $driver = $this->getOrderDetails($tracking_number)['driver'];
        $updated_at = $this->getOrderDetails($tracking_number)['updated_at'];
        Mail::to($email)->send(new OrderStatusUpdated(
            $name,
            $tracking_number,
            $status,
            $delivery_date,
            $driver ?? "",
            $address,
            $updated_at
        ));
    }

    public function getOrderDetails($tracking_number)
    {
        return DBPackages::join('tbl_orderCustomers', 'tbl_orderCustomers.id', 'tbl_packages.customer_id')
            ->join('tbl_deliveries', 'tbl_deliveries.id', 'tbl_packages.delivery_id')
            ->join('tbl_users', 'tbl_users.id', 'tbl_deliveries.driver_id')
            ->where(['tbl_packages.tracking_number' => $tracking_number])
            ->select([
                'tbl_orderCustomers.email as email',
                'tbl_orderCustomers.name',
                'tbl_deliveries.delivery_date',
                'tbl_packages.address',
                'tbl_deliveries.status',
                'tbl_users.name as driver',
                'tbl_packages.updated_at'
            ], )->first();
    }


}