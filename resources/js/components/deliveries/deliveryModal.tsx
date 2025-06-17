import { AlignLeft, MapPin, PackageCheck, User, Weight } from 'lucide-react';

interface Props {
    setIsOpen: (open: boolean) => void;
    packageInfo: Package | null;
}
interface Package {
    tracking_number: string;
    name: string;
    weight: string;
    address: string;
    description: string;
}

export const DeliveryModal: React.FC<Props> = ({ setIsOpen, packageInfo }) => {
    return (
        <div className="modal-open modal backdrop-blur-sm">
            <div className="animate-fade-in-up modal-box max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-neutral-content dark:bg-neutral">
                <h3 className="mb-4 text-center text-xl font-bold text-blue-600 dark:text-blue-400">📦 Delivery Details</h3>

                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    <div className="flex items-start gap-2">
                        <PackageCheck size={20} className="mt-1 text-blue-500" />
                        <div>
                            <p className="font-semibold">Tracking Number</p>
                            <p>{packageInfo && packageInfo.tracking_number}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <User size={20} className="mt-1 text-green-500" />
                        <div>
                            <p className="font-semibold">Customer Name</p>
                            <p>{packageInfo && packageInfo && packageInfo.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <Weight size={20} className="mt-1 text-purple-500" />
                        <div>
                            <p className="font-semibold">Weight</p>
                            <p>{packageInfo && packageInfo && packageInfo.weight + 'kg'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <MapPin size={20} className="mt-1 text-red-500" />
                        <div>
                            <p className="font-semibold">Address</p>
                            <p>{packageInfo && packageInfo && packageInfo.address}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <AlignLeft size={20} className="mt-1 text-yellow-500" />
                        <div>
                            <p className="font-semibold">Description</p>
                            <p>{packageInfo && packageInfo.description}</p>
                        </div>
                    </div>
                </div>

                <div className="modal-action mt-6">
                    <button className="btn rounded-lg btn-outline btn-error" onClick={() => setIsOpen(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
