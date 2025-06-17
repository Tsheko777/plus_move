import moment from 'moment';

interface Props {
    setDeliveryModal: (modal: boolean) => void;
    delivery: Delivery | null;
}
interface Delivery {
    driver: string;
    customer: string;
    date: string;
}
export const DeliveryModal: React.FC<Props> = ({ delivery, setDeliveryModal }) => {
    return (
        <div className="modal-open modal bg-black/30 backdrop-blur-sm">
            <div className="animate-fade-in-up relative modal-box max-w-md overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
                {/* Vertical accent bar */}
                <div className="absolute top-0 left-0 h-full w-1.5 rounded-l-3xl bg-emerald-500"></div>

                <h3 className="mt-2 mb-8 flex items-center justify-center gap-2 text-center text-2xl font-extrabold text-emerald-600 select-none dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 0h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-2 0h-6m-6 0H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h6"
                        />
                    </svg>
                    Delivery Info
                </h3>

                <div className="space-y-6 text-base text-gray-800 select-text dark:text-gray-300">
                    {/* Customer Name */}
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-2 text-emerald-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A5 5 0 1116.88 6.196a5 5 0 01-11.757 11.608z" />
                            </svg>
                        </span>
                        <div className="flex-1 font-semibold">Customer Name:</div>
                        <div className="flex-1 truncate text-right font-medium">{delivery && delivery.customer}</div>
                    </div>

                    {/* Driver Name */}
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 10-8 0 4 4 0 008 0zM12 14v4" />
                            </svg>
                        </span>
                        <div className="flex-1 font-semibold">Driver Name:</div>
                        <div className="flex-1 truncate text-right font-medium">{delivery && delivery.driver}</div>
                    </div>

                    {/* Delivery Date */}
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-2 text-yellow-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <div className="flex-1 font-semibold">Delivery Date:</div>
                        <div className="flex-1 truncate text-right font-medium">
                            {delivery && delivery.date ? moment(delivery.date).format('DD MMMM Y') : '-'}
                        </div>
                    </div>
                </div>

                <div className="modal-action mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setDeliveryModal(false)}
                        className="btn rounded-full px-10 py-2 font-bold transition-shadow duration-300 btn-outline btn-error hover:shadow-lg"
                    >
                        ❌ Close
                    </button>
                </div>
            </div>
        </div>
    );
};
