<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderStatusUpdated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $customer_name;
    public $tracking_number;
    public $status;
    public $delivery_date;
    public $driver_name;
    public $address;
    public $updated_at;

    /**
     * Create a new message instance.
     */
    public function __construct(
        $customer_name,
        $tracking_number,
        $status,
        $delivery_date = null,
        $driver_name = null,
        $address = null,
        $updated_at = null
    ) {
        $this->customer_name = $customer_name;
        $this->tracking_number = $tracking_number;
        $this->status = $status;
        $this->delivery_date = $delivery_date;
        $this->driver_name = $driver_name;
        $this->address = $address;
        $this->updated_at = $updated_at;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Order Status Updated')
            ->view('email.status');
    }
}
