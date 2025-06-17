@php
    switch ($status) {
        case 'created':
            $statusColor = '#3b82f6';
            break;
        case 'shipped':
            $statusColor = '#8b5cf6';
            break;
        case 'in_transit':
            $statusColor = '#facc15';
            break;
        case 'delivered':
            $statusColor = '#22c55e';
            break;
        case 'returned':
            $statusColor = '#ef4444';
            break;
        default:
            $statusColor = '#6b7280';
    }
@endphp

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Order Status Update</title>
</head>

<body style="margin:0;margin-top:20px; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
    <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:30px; border-radius:8px;">

        <h2 style="color:#111827; margin-bottom:20px;">📦 Order Tracking Update</h2>

        <p style="font-size:16px; color:#374151; margin-bottom:20px;">
            Dear {{ $customer_name ?? 'Customer' }},
        </p>

        <p style="font-size:16px; color:#374151; margin-bottom:20px;">
            Your package with tracking number <strong>{{ $tracking_number ?? 'TRK123456' }}</strong> has been updated to
            the following status:
        </p>

        <div
            style="background-color:#f9f9f9; padding:15px 20px; border-left:5px solid {{ $statusColor }}; font-size:16px; margin-bottom:20px;">
            <strong>Status:</strong> {{ ucfirst(str_replace('_', ' ', $status)) }}
        </div>

        <p style="font-size:16px; color:#374151; margin-bottom:10px;"><strong>Delivery Date:</strong>
            {{ $delivery_date ?? 'N/A' }}</p>
        <p style="font-size:16px; color:#374151; margin-bottom:10px;"><strong>Driver:</strong>
            {{ $driver_name ?? 'Not Assigned' }}</p>
        <p style="font-size:16px; color:#374151; margin-bottom:10px;"><strong>Address:</strong> {{ $address ?? 'N/A' }}
        </p>

        <p style="color:#9ca3af;">Package updated at {{ $updated_at }}</p>
        <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

        <a href="{{ url('/track/package/' . $tracking_number) }}">Track status</a>

        <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

        <p style="font-size:14px; color:#9ca3af;">
            If you have any questions or need assistance, feel free to contact our support team.
        </p>

        <p style="font-size:14px; color:#9ca3af;">Thank you for choosing our service!</p>
    </div>
</body>

</html>