import { Pagination } from '@/components/app-pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { RefreshCcw, Truck, Users } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';

interface Driver {
    id: number;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    deliveries_count: number;
    deliveries_completed: number;
    returns_count: number;
    last_delivery_date?: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedDrivers {
    data: Driver[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface DriverSummary {
    totalDrivers: number;
    activeDrivers: number;
    totalDeliveries: number;
    totalReturns: number;
}

interface Props {
    drivers: PaginatedDrivers;
    summary: DriverSummary;
}

type SortKey = 'deliveries_count' | 'deliveries_completed' | 'returns_count' | 'last_delivery_date' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function Drivers({ drivers, summary }: Props) {
    const [sortKey, setSortKey] = useState<SortKey | null>('deliveries_count');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [emailSearch, setEmailSearch] = useState('');
    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedDrivers = useMemo(() => {
        if (!sortKey) return drivers.data;

        return [...drivers.data].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];

            if (valA == null) return 1;
            if (valB == null) return -1;

            if (sortKey === 'last_delivery_date' || sortKey === 'created_at') {
                const timeA = new Date(valA).getTime();
                const timeB = new Date(valB).getTime();
                return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
            }

            return sortDirection === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
        });
    }, [drivers.data, sortKey, sortDirection]);

    const renderSortIcon = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailSearch) router.get('/drivers/' + emailSearch);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Drivers', href: '/drivers' }]}>
            <Head title="Drivers" />
            <div className="space-y-6 p-6">
                <div className="flex">
                    <h1 className="w-full text-2xl font-bold text-neutral-800 dark:text-white">Drivers</h1>
                    <form onSubmit={handleSearch} className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search by email"
                            className="rounded border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900 dark:text-white"
                            value={emailSearch}
                            onChange={(e) => setEmailSearch(e.target.value)}
                        />
                        <button type="submit" className="btn gap-2 btn-primary">
                            Search
                        </button>
                    </form>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-5 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase opacity-80">Total Drivers</p>
                                <h2 className="text-3xl font-bold">{summary.totalDrivers}</h2>
                            </div>
                            <Users size={28} className="opacity-60" />
                        </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-700 p-5 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase opacity-80">Active Drivers</p>
                                <h2 className="text-3xl font-bold">{summary.activeDrivers}</h2>
                            </div>
                            <Users size={28} className="opacity-60" />
                        </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase opacity-80">Total Deliveries</p>
                                <h2 className="text-3xl font-bold">{summary.totalDeliveries}</h2>
                            </div>
                            <Truck size={28} className="opacity-60" />
                        </div>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-5 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase opacity-80">Total Returns</p>
                                <h2 className="text-3xl font-bold">{summary.totalReturns}</h2>
                            </div>
                            <RefreshCcw size={28} className="opacity-60" />
                        </div>
                    </div>
                </div>

                {drivers.data.length === 0 ? (
                    <p>No drivers found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow transition-colors dark:border-neutral-700 dark:bg-[#1e1e1e]">
                        <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-200">
                            <thead className="bg-neutral-100 text-xs uppercase dark:bg-neutral-800 dark:text-neutral-400">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                    <th className="px-6 py-3">City</th>
                                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('deliveries_count')}>
                                        Deliveries {renderSortIcon('deliveries_count')}
                                    </th>
                                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('deliveries_completed')}>
                                        Completed {renderSortIcon('deliveries_completed')}
                                    </th>
                                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('returns_count')}>
                                        Returns {renderSortIcon('returns_count')}
                                    </th>
                                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('last_delivery_date')}>
                                        Last Delivery {renderSortIcon('last_delivery_date')}
                                    </th>
                                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('created_at')}>
                                        Joined {renderSortIcon('created_at')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDrivers.map((driver) => (
                                    <tr key={driver.id} className="border-b hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                        <td className="px-6 py-4">{driver.name}</td>
                                        <td className="px-6 py-4">{driver.email}</td>
                                        <td className="px-6 py-4">{driver.phone || '-'}</td>
                                        <td className="px-6 py-4">{driver.city || '-'}</td>
                                        <td className="px-6 py-4">{driver.deliveries_count}</td>
                                        <td className="px-6 py-4">{driver.deliveries_completed}</td>
                                        <td className="px-6 py-4">{driver.returns_count}</td>
                                        <td className="px-6 py-4">
                                            {driver.last_delivery_date ? moment(driver.last_delivery_date).format('DD MMMM Y') : '-'}
                                        </td>
                                        <td className="px-6 py-4">{moment(driver.created_at).format('DD MMMM Y')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="p-6">
                            <Pagination links={drivers.links} />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
