import { Pagination } from '@/components/app-pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RefreshCcw, Sparkles, Truck, Users } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface DashboardData {
    totalDeliveries: number;
    activeDrivers: number;
    currentReturns: number;
    recentDeliveries: Data;
}

interface Data {
    data: any[];
    links?: any[];
}

interface Delivery {
    name: string;
    status: string;
    delivered_at: string;
    delivery_date: string;
    tracking_number: string;
    driver: string;
}

interface Props {
    dashboard: DashboardData;
}

type SortDirection = 'asc' | 'desc';

export default function Dashboard({ dashboard }: Props) {
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const sortedDeliveries = useMemo(() => {
        return [...dashboard.recentDeliveries.data].sort((a: Delivery, b: Delivery) => {
            const aDate = new Date(a.delivered_at || 0).getTime();
            const bDate = new Date(b.delivered_at || 0).getTime();
            return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
        });
    }, [dashboard.recentDeliveries.data, sortDirection]);

    const toggleSort = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-10 p-6">
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        {
                            title: 'Total Deliveries',
                            value: dashboard ? dashboard.totalDeliveries : 0,
                            icon: <Truck size={28} />,
                            change: 'since last week',
                            colors: 'from-blue-500 to-blue-700',
                        },
                        {
                            title: 'Returns',
                            value: dashboard ? dashboard.currentReturns : 0,
                            icon: <RefreshCcw size={28} />,
                            change: 'this month',
                            colors: 'from-red-500 to-red-700',
                        },
                        {
                            title: 'Active Drivers',
                            value: dashboard ? dashboard.activeDrivers : 0,
                            icon: <Users size={28} />,
                            change: 'all time',
                            colors: 'from-green-500 to-green-700',
                        },
                    ].map(({ title, value, icon, change, colors }) => (
                        <div
                            key={title}
                            className={`bg-gradient-to-br ${colors} rounded-2xl p-5 text-white shadow-xl transition-transform hover:scale-[1.02]`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm tracking-wide uppercase opacity-80">{title}</p>
                                    <h2 className="mt-1 text-4xl font-bold">{value}</h2>
                                    <p className="mt-1 text-sm opacity-70">{change}</p>
                                </div>
                                <div className="opacity-60">{icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow transition-colors dark:border-neutral-700 dark:bg-[#1e1e1e]">
                    <div className="p-6">
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-neutral-800 dark:text-white">
                            <Sparkles className="text-yellow-500 dark:text-yellow-400" />
                            Recent Deliveries
                        </h3>
                        {dashboard && dashboard.recentDeliveries.data.length > 0 ? (
                            <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-200">
                                <thead className="bg-neutral-100 text-xs uppercase dark:bg-neutral-800 dark:text-neutral-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Tracking #
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Customer
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Driver
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="cursor-pointer px-6 py-3 select-none" onClick={toggleSort}>
                                            Delivered {sortDirection === 'asc' ? '↑' : '↓'}
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Delivery Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedDeliveries.map((val: Delivery, key: number) => (
                                        <tr key={key} className="border-b hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4">{val.tracking_number}</td>
                                            <td className="px-6 py-4">{val.name}</td>
                                            <td className="px-6 py-4">{val.driver}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={
                                                        val.status === 'created'
                                                            ? 'inline-block rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                                            : val.status === 'shipped'
                                                              ? 'inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                                              : val.status === 'in_transit'
                                                                ? 'inline-block rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'
                                                                : val.status === 'delivered'
                                                                  ? 'inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100'
                                                                  : val.status === 'returned'
                                                                    ? 'inline-block rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100'
                                                                    : 'inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                                                    }
                                                >
                                                    {val.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {val.delivered_at ? moment(val.delivered_at).format('DD MMMM Y H:mm:ss') : '-'}
                                            </td>{' '}
                                            <td className="px-6 py-4">{val.delivery_date ? moment(val.delivery_date).format('DD MMMM Y ') : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>No recent deliveries</div>
                        )}
                        <Pagination links={dashboard.recentDeliveries.links || []} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
