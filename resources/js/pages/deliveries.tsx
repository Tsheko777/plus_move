import axios from '@/axios';
import { Pagination } from '@/components/app-pagination';
import { DeliveriesTable } from '@/components/deliveries/deliveriesTable';
import { DeliveryModal } from '@/components/deliveries/deliveryModal';
import { UpdateStatusModal } from '@/components/deliveries/updateStatusModal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Package, RefreshCcw, Truck } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Deliveries', href: '/deliveries' },
];

interface DeliveriesData {
    total: number;
    intransit: number;
    returned: number;
    recentDeliveries: [];
}

interface Package {
    tracking_number: string;
    name: string;
    weight: string;
    address: string;
    description: string;
}

interface Props {
    deliveries: DeliveriesData;
}

export default function Deliveries({ deliveries }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ tracking_number: '', status: '', delivery_id: '' });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [isOpen, setIsOpen] = useState(false);
    const [packageInfo, setPackage] = useState<Package | null>(null);

    const getPackage = (tracking_number: string) => {
        axios
            .post('/api/deliveries/package/get', { tracking_number: tracking_number })
            .then((res) => setPackage(res.data))
            .catch(console.error);
    };

    const updateStatus = () => {
        axios
            .post('/api/deliveries/update', form)
            .then((res) => {
                setToastMessage(res.data?.message || 'Delivery updated successfully!');
                setToastType('success');
                setForm({ tracking_number: '', status: '', delivery_id: '' });
                router.visit('/deliveries', {
                    preserveScroll: true,
                    preserveState: true,
                });
            })
            .catch((err) => {
                setToastMessage(err.response.data.message ? err.response.data.message : 'Failed to update delivery');
                setToastType('error');
                console.error(err);
            });
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deliveries" />

            <div className="space-y-5 p-6">
                <div className="toast-top toast-end toast z-[1000]">
                    {toastMessage && (
                        <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-error'}`}>
                            <span>{toastMessage}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Deliveries</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 text-white shadow-xl transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm tracking-wide uppercase opacity-80">Total Deliveries</p>
                                <h2 className="mt-1 text-4xl font-bold">{deliveries ? deliveries.total : 0}</h2>
                                <p className="mt-1 text-sm opacity-70">All-time</p>
                            </div>
                            <Truck size={28} className="opacity-60" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 p-5 text-white shadow-xl transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm tracking-wide uppercase opacity-80">In Transit</p>
                                <h2 className="mt-1 text-4xl font-bold">{deliveries ? deliveries.intransit : 0}</h2>
                                <p className="mt-1 text-sm opacity-70">Current</p>
                            </div>
                            <Package size={28} className="opacity-60" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-5 text-white shadow-xl transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm tracking-wide uppercase opacity-80">Returned</p>
                                <h2 className="mt-1 text-4xl font-bold">{deliveries ? deliveries.returned : 0}</h2>
                                <p className="mt-1 text-sm opacity-70">This week</p>
                            </div>
                            <RefreshCcw size={28} className="opacity-60" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow transition-colors dark:border-neutral-700 dark:bg-[#1e1e1e]">
                    <div className="p-6">
                        <div className="flex">
                            <h3 className="mb-4 flex w-full items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-white">
                                <Truck className="text-blue-500 dark:text-blue-400" />
                                Recent Deliveries
                            </h3>
                            <select
                                onChange={(e) => {
                                    if (e.target.value) router.get('/deliveries/status/' + e.target.value);
                                }}
                                className="select mb-4 border border-gray-200 text-black"
                                required
                            >
                                <option value="">Select status</option>
                                <option value="created">Created</option>
                                <option value="shipped">Shipped</option>
                                <option value="in_transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="returned">Returned</option>
                            </select>
                        </div>

                        {deliveries && deliveries.recentDeliveries.data.length > 0 ? (
                            <DeliveriesTable
                                form={form}
                                setForm={setForm}
                                setShowModal={setShowModal}
                                deliveries={deliveries}
                                setIsOpen={setIsOpen}
                                getPackage={getPackage}
                            />
                        ) : (
                            <div>No recent deliveries</div>
                        )}
                    </div>
                </div>
                <Pagination links={deliveries.recentDeliveries.links} />
                {showModal && <UpdateStatusModal form={form} setForm={setForm} setShowModal={setShowModal} updateStatus={updateStatus} />}

                {isOpen && <DeliveryModal setIsOpen={setIsOpen} packageInfo={packageInfo} />}
            </div>
        </AppLayout>
    );
}
