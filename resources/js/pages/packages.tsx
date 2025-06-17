import axios from '@/axios';
import { Pagination } from '@/components/app-pagination';
import { CreatePackage } from '@/components/deliveries/createPackage';
import { DeliveryModal } from '@/components/packages/deliveryModal';
import { PackageTable } from '@/components/packages/packageTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PackageCheck, PackagePlus, PackageX, Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Packages', href: '/packages' },
];

interface PackageData {
    total: number;
    delivered: number;
    pending: number;
    recentPending: Data;
    freeDrivers: [];
}

interface Delivery {
    driver: string;
    customer: string;
    date: string;
}

interface Data {
    data: [];
}

interface Props {
    packages: PackageData;
}

export default function Packages({ packages }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ email: '', date: '', customer: '', weight: '', description: '', address: '', phone: '', city: '' });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [deliveryModal, setDeliveryModal] = useState(false);
    const [delivery, setDelivery] = useState<Delivery | null>(null);

    const getDelivery = (tracking_number: string) => {
        axios
            .post('/api/packages/delivery/get', { tracking_number: tracking_number })
            .then((res) => setDelivery(res.data))
            .catch(console.error);
    };

    const newPackage = () => {
        axios
            .post('/api/packages/create', form)
            .then((res) => {
                setToastMessage(res.data?.message || 'Package added successfully!');
                setForm({
                    date: '',
                    email: '',
                    customer: '',
                    weight: '',
                    description: '',
                    address: '',
                    phone: '',
                    city: '',
                });
                setToastType('success');
                router.visit('/packages', {
                    preserveScroll: true,
                    preserveState: true,
                });
            })
            .catch((err) => {
                setToastMessage(err.response.data.message ? err.response.data.message : 'Failed to update package');
                setToastType('error');
                console.error(err);
            });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const deletePackage = (tracking_number: string) => {
        const deletePackage = confirm('You are about to delete packge, press Ok to proceed or cancel');
        if (deletePackage) {
            axios
                .post('/api/packages/delete', { tracking_number: tracking_number }) // Assuming tracking_number is the identifier for the package
                .then((res) => {
                    setToastMessage(res.data?.message || 'Package deleted successfully!');
                    setToastType('success');
                    router.visit('/packages', {
                        preserveScroll: true,
                        preserveState: true,
                    });
                })
                .catch((err) => {
                    setToastMessage(err.response.data.message ? err.response.data.message : 'Failed to delete package');
                    setToastType('error');
                    console.error(err);
                });
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packages" />
            <div className="space-y-5 p-6">
                <div className="toast-top toast-end toast z-[1000]">
                    {toastMessage && (
                        <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-error'}`}>
                            <span>{toastMessage}</span>
                        </div>
                    )}
                </div>
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Packages</h1>
                    <button onClick={() => setShowModal(true)} className="btn gap-2 btn-primary">
                        <Plus size={18} />
                        Create Package
                    </button>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white shadow-xl transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm tracking-wide uppercase opacity-80">Total Packages</p>
                                <h2 className="mt-1 text-4xl font-bold">{packages ? packages.total : 0}</h2>
                                <p className="mt-1 text-sm opacity-70">All time</p>
                            </div>
                            <PackagePlus size={28} className="opacity-60" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-5 text-white shadow-xl transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm tracking-wide uppercase opacity-80">Delivered</p>
                                <h2 className="mt-1 text-4xl font-bold">{packages ? packages.delivered : 0}</h2>
                                <p className="mt-1 text-sm opacity-70">Up to today</p>
                            </div>
                            <PackageCheck size={28} className="opacity-60" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 p-5 text-white shadow-xl transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm tracking-wide uppercase opacity-80">Pending</p>
                                <h2 className="mt-1 text-4xl font-bold">{packages ? packages.pending : 0}</h2>
                                <p className="mt-1 text-sm opacity-70">Awaiting delivery</p>
                            </div>
                            <PackageX size={28} className="opacity-60" />
                        </div>
                    </div>
                </div>

                {/* Packages Table */}
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow transition-colors dark:border-neutral-700 dark:bg-[#1e1e1e]">
                    <div className="p-6">
                        <div className="align-center flex justify-center">
                            <h3 className="mb-4 flex w-full items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-white">
                                <PackagePlus className="text-indigo-500 dark:text-indigo-400" />
                                Package Records
                            </h3>
                            <select
                                onChange={(e) => {
                                    if (e.target.value) router.get('/packages/status/' + e.target.value);
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

                        {packages && packages.recentPending.data ? (
                            <PackageTable
                                packages={packages}
                                setDeliveryModal={setDeliveryModal}
                                getDelivery={getDelivery}
                                deletePackage={deletePackage}
                            />
                        ) : (
                            <div>No packages</div>
                        )}
                    </div>
                </div>

                {deliveryModal && <DeliveryModal delivery={delivery} setDeliveryModal={setDeliveryModal} />}

                {/* Create Package Modal */}
                {showModal && <CreatePackage newPackage={newPackage} setForm={setForm} form={form} setShowModal={setShowModal} />}
                <Pagination links={packages.recentPending.links} />
            </div>
        </AppLayout>
    );
}
