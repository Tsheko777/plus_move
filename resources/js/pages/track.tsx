import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, Truck } from 'lucide-react';

interface CustomerInfo {
    name: string;
    email: string;
    city: string;
}

interface TrackPackageProps {
    tracking_number: string;
    status: 'created' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
    delivered_at: string | null;
    delivery_date: string | null;
    customer: CustomerInfo;
}

export default function TrackPackage({ tracking_number, status, delivered_at, delivery_date, customer }: TrackPackageProps) {
    const statusSteps = [
        { id: 'created', label: 'Created 📝' },
        { id: 'shipped', label: 'Shipped 📦' },
        { id: 'in_transit', label: 'In Transit 🚚' },
        { id: 'delivered', label: 'Delivered ✅' },
        { id: 'returned', label: 'Returned ↩️' },
    ];

    const currentStepIndex = statusSteps.findIndex((step) => step.id === status);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-200 to-base-100 p-6">
            <Head title={`Tracking #${tracking_number}`} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl space-y-6 rounded-2xl bg-white p-8 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">📦 Track Your Package</h2>
                    <span className="badge badge-outline badge-info">#{tracking_number}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-gray-600">Customer</p>
                        <p className="text-gray-600">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-600">Destination</p>
                        <p className="text-gray-600">
                            <MapPin className="mr-1 inline-block h-4 w-4" /> {customer.city}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="divider">Delivery Status</div>

                    <ul className="steps steps-horizontal w-full overflow-x-auto text-gray-600">
                        {statusSteps.map((step, index) => (
                            <li key={step.id} className={`step ${index <= currentStepIndex ? 'step-primary' : ''}`}>
                                {step.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2 rounded-lg border bg-base-100 p-4 text-black">
                    <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-success" />
                        <span className="text-sm">
                            <strong>Status:</strong> <span className="capitalize">{status.replace('_', ' ')}</span>
                        </span>
                    </div>
                    {delivered_at && (
                        <div className="flex items-center gap-2 text-success">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm">Delivered at {new Date(delivered_at).toLocaleString()}</span>
                        </div>
                    )}
                    {delivery_date && !delivered_at && (
                        <div className="flex items-center gap-2 text-warning">
                            <Clock className="h-5 w-5" />
                            <span className="text-sm">Estimated delivery: {delivery_date}</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
