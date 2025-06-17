interface ReportModalProps {
    createReport: () => void;
    setNotes: (notes: string) => void;
    setShowModal: (show: boolean) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ createReport, setNotes, setShowModal }) => {
    return (
        <dialog className="modal-open modal">
            <div className="modal-box dark:bg-neutral dark:text-white">
                <h3 className="mb-4 text-lg font-bold">New Report</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createReport();
                    }}
                    className="space-y-4"
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text dark:text-neutral-200">Notes</span>
                        </label>
                        <textarea
                            onChange={(e) => setNotes(e.target.value)}
                            id="notes"
                            className="textarea w-full border border-gray-200 text-black"
                            placeholder="Optional notes..."
                        ></textarea>
                    </div>

                    <div className="modal-action">
                        <button className="btn btn-success">Save</button>
                        <button type="button" className="btn" onClick={() => setShowModal(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};
