interface Props {
    form: DeliveryForm;
    setForm: (form: DeliveryForm) => void;
    setShowModal: (modal: boolean) => void;
    updateStatus: () => void;
}
interface DeliveryForm {
    tracking_number: string;
    status: string;
    delivery_id: string;
}
export const UpdateStatusModal: React.FC<Props> = ({ form, setForm, setShowModal, updateStatus }) => {
    return (
        <div className="modal-open modal backdrop-blur-sm">
            <div className="animate-fade-in-up modal-box max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral dark:text-white">
                <h3 className="mb-6 text-center text-xl font-bold text-blue-600 dark:text-blue-400">🚚 Update Delivery</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateStatus();
                    }}
                    className="space-y-5"
                >
                    {/* Tracking Number (Read-only Display) */}
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                        <span className="font-semibold">Tracking No:</span>
                        <span>{form.tracking_number}</span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Status</span>
                        </label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="select w-full border border-gray-200 text-black"
                            required
                        >
                            <option disabled value="">
                                Select status
                            </option>
                            <option value="created">Created</option>
                            <option value="shipped">Shipped</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="returned">Returned</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="modal-action mt-6 justify-between">
                        <button type="submit" className="btn rounded-lg btn-success">
                            ✅ Update
                        </button>
                        <button type="button" className="btn rounded-lg btn-outline btn-error" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
