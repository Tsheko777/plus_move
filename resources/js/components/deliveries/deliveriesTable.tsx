import { Pencil } from 'lucide-react';
import moment from 'moment';
import { useMemo, useState } from 'react';

interface Delivery {
    updated_at: string;
    tracking_number: string;
    customer_name: string;
    driver_name: string;
    status: string;
    delivery_date: string;
    delivery_id: string;
}

interface Props {
    form: Form;
    setForm: (from: Form) => void;
    setIsOpen: (open: boolean) => void;
    deliveries: DeliveriesData;
    setShowModal: (modal: boolean) => void;
    getPackage: (tracking_number: string) => void;
}

interface Form {
    tracking_number: string;
    status: string;
    delivery_id: string;
}

interface DeliveriesData {
    total: number;
    intransit: number;
    returned: number;
    recentDeliveries: { data: Delivery[] };
}

type SortKey = 'updated_at' | 'delivery_date';
type SortDirection = 'asc' | 'desc';

export const DeliveriesTable: React.FC<Props> = ({ form, setForm, setIsOpen, deliveries, setShowModal, getPackage }) => {
    const [sortKey, setSortKey] = useState<SortKey | null>('delivery_date');
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
        if (!sortKey) return deliveries.recentDeliveries.data;
        return [...deliveries.recentDeliveries.data].sort((a, b) => {
            const aTime = a[sortKey] ? new Date(a[sortKey]).getTime() : 0;
            const bTime = b[sortKey] ? new Date(b[sortKey]).getTime() : 0;
            return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
        });
    }, [deliveries.recentDeliveries.data, sortKey, sortDirection]);

    const renderSortArrow = (key: SortKey) => (sortKey === key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '');

    return (
        <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-200">
            <thead className="bg-neutral-100 text-xs uppercase dark:bg-neutral-800 dark:text-neutral-400">
                <tr>
                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('updated_at')}>
                        Updated At{renderSortArrow('updated_at')}
                    </th>
                    <th className="px-6 py-3">Tracking #</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Driver</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="cursor-pointer px-6 py-3" onClick={() => handleSort('delivery_date')}>
                        Delivery Date{renderSortArrow('delivery_date')}
                    </th>
                    <th className="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.length > 0 &&
                    sortedData.map((val: Delivery, key: number) => (
                        <tr key={key} className="border-b hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                            <td className="px-6 py-4">{val.updated_at ? moment(val.updated_at).format('DD MMMM Y H:mm:ss') : '-'}</td>
                            <td className="px-6 py-4">
                                <span
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => {
                                        getPackage(val.tracking_number);
                                        setIsOpen(true);
                                    }}
                                >
                                    {val.tracking_number}
                                </span>
                            </td>
                            <td className="px-6 py-4">{val.customer_name}</td>
                            <td className="px-6 py-4">{val.driver_name}</td>
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
                            <td className="px-6 py-4">{val.delivery_date ? moment(val.delivery_date).format('DD MMMM Y') : '-'}</td>
                            <td className="px-6 py-4">
                                {val.status !== 'delivered' && (
                                    <Pencil
                                        color="blue"
                                        onClick={() => {
                                            setShowModal(true);
                                            setForm({
                                                ...form,
                                                tracking_number: val.tracking_number,
                                                delivery_id: val.delivery_id,
                                            });
                                        }}
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
