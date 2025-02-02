interface ModalProps {
    show: boolean;
    handleClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ show, handleClose, children }: ModalProps) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-11/12 max-w-md relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
                {children}
            </div>
        </div>
    )
}