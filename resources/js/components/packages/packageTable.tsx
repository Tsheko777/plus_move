import { DeleteIcon } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';

interface Package {
    tracking_number: string;
    name: string;
    weight: number;
    status: string;
    delivered_at: string;
    created_at: string;
}

interface Props {
    packages: PackageData;
    setDeliveryModal: (modal: boolean) => void;
    getDelivery: (val: string) => void;
    deletePackage: (val: string) => void;
}

interface PackageData {
    total: number;
    delivered: number;
    pending: number;
    recentPending: { data: Package[] };
    freeDrivers: [];
}

type SortKey = 'delivered_at' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const PackageTable: React.FC<Props> = ({ packages, setDeliveryModal, getDelivery, deletePackage }) => {
    const [sortKey, setSortKey] = useState<SortKey | null>('created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = useMemo(() => {
        if (!sortKey) return packages.recentPending.data;

        return [...packages.recentPending.data].sort((a, b) => {
            const timeA = a[sortKey] ? new Date(a[sortKey]).getTime() : 0;
            const timeB = b[sortKey] ? new Date(b[sortKey]).getTime() : 0;
            return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
        });
    }, [packages.recentPending.data, sortKey, sortDirection]);

    const renderSortArrow = (key: SortKey) => (sortKey === key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '');

    return (
        <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-200">
            <thead className="bg-neutral-100 text-xs uppercase dark:bg-neutral-800 dark:text-neutral-400">
                <tr>
                    <th className="px-6 py-3">Tracking #</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Weight (kg)</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('delivered_at')}>
                        Delivered At{renderSortArrow('delivered_at')}
                    </th>
                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('created_at')}>
                        Created At{renderSortArrow('created_at')}
                    </th>
                    <th className="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((val: Package, key: number) => (
                    <tr key={key} className="border-b hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                        <td className="px-6 py-4">
                            <span
                                className="cursor-pointer text-blue-600 hover:underline"
                                onClick={() => {
                                    setDeliveryModal(true);
                                    getDelivery(val.tracking_number);
                                }}
                            >
                                {val.tracking_number}
                            </span>
                        </td>
                        <td className="px-6 py-4">{val.name}</td>
                        <td className="px-6 py-4">{val.weight}</td>
                        <td className="px-6 py-4">
                            <span
                                className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                                    val.status === 'created'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                                        : val.status === 'shipped'
                                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                          : val.status === 'in_transit'
                                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100'
                                            : val.status === 'delivered'
                                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                              : val.status === 'returned'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                                }`}
                            >
                                {val.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">{val.delivered_at ? moment(val.delivered_at).format('DD MMM Y HH:mm:ss') : '-'}</td>
                        <td className="px-6 py-4">{val.created_at ? moment(val.created_at).format('DD MMM Y HH:mm:ss') : '-'}</td>
                        <td className="px-6 py-4">
                            {val.status !== 'delivered' && (
                                <DeleteIcon
                                    color="red"
                                    onClick={() => deletePackage(val.tracking_number)}
                                    size={20}
                                    className="cursor-pointer opacity-60"
                                />
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
