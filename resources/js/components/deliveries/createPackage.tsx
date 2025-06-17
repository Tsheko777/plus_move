interface Props {
    newPackage: () => void;
    setForm: (form: Form) => void;
    form: Form;
    setShowModal: (modal: boolean) => void;
}

interface Form {
    date: string;
    customer: string;
    weight: string;
    description: string;
    address: string;
    phone: string;
    city: string;
    email: string;
}

export const CreatePackage: React.FC<Props> = ({ newPackage, setForm, form, setShowModal }) => {
    return (
        <div className="modal-open modal backdrop-blur-sm">
            <div className="animate-fade-in-up modal-box max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:bg-neutral dark:text-white">
                <h3 className="mb-6 text-center text-xl font-bold text-indigo-600 dark:text-indigo-400">📦 Create New Package</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        newPackage();
                    }}
                    className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                    {/* Customer Name */}
                    <div className="form-control col-span-1">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Customer Name</span>
                        </label>
                        <input
                            onChange={(e) => setForm({ ...form, customer: e.target.value })}
                            value={form.customer}
                            type="text"
                            placeholder="e.g. John Doe"
                            className="input w-full border border-gray-200 text-black"
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="form-control col-span-1">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Phone Number</span>
                        </label>
                        <input
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            value={form.phone}
                            type="number"
                            placeholder="0000000000"
                            className="input w-full border border-gray-200 text-black"
                            required
                        />
                    </div>

                    {/* City */}
                    <div className="form-control col-span-1">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">City</span>
                        </label>
                        <input
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            value={form.city}
                            type="text"
                            placeholder="e.g. Pretoria"
                            className="iw-full input w-full border border-gray-200 text-black"
                            required
                        />
                    </div>

                    {/* Weight */}
                    <div className="form-control col-span-1">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Weight (kg)</span>
                        </label>
                        <input
                            onChange={(e) => setForm({ ...form, weight: e.target.value })}
                            value={form.weight}
                            type="number"
                            step="0.01"
                            placeholder="e.g. 2.5"
                            className="input w-full border border-gray-200 text-black"
                            required
                        />
                    </div>

                    {/* Date */}
                    <div className="form-control col-span-1">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Delivery Date</span>
                        </label>
                        <input
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            value={form.date}
                            type="date"
                            className="input-bordered input w-full border border-gray-200 text-black"
                            required
                        />
                    </div>
                    <div className="form-control col-span-1">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Email address</span>
                        </label>
                        <input
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            value={form.email}
                            type="text"
                            placeholder="email@example.com"
                            className="input-bordered input w-full border border-gray-200 text-black"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-control col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Description</span>
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="textarea w-full border border-gray-200 text-black dark:border-gray-700"
                            placeholder="e.g. 2x laptops, 1x charger"
                            required
                        ></textarea>
                    </div>

                    {/* Address */}
                    <div className="form-control col-span-2">
                        <label className="label">
                            <span className="label-text font-semibold dark:text-neutral-200">Address</span>
                        </label>
                        <textarea
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="textarea w-full border border-gray-200 text-black"
                            placeholder="Full delivery address"
                            required
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="col-span-2 modal-action mt-4 flex justify-between">
                        <button type="submit" className="btn rounded-lg btn-primary">
                            🚀 Save Package
                        </button>
                        <button type="button" className="btn rounded-lg btn-outline btn-error" onClick={() => setShowModal(false)}>
                            ❌ Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
