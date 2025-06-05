import { useRef, useState } from "react";
import DeleteProductForm from "../../forms/product/DeleteProductForm";
import type { Products } from "../../interfaces/product/Products";
import AlertMessage from "../../AlertMessage";
import SmolSpinner from "../../SmolSpinner";

interface DeleteProductModalProps {
    showModal: boolean;
    product: Products | null;
    onRefreshProducts: (refresh: boolean) => void;
    onClose: () => void;
}

const DeleteProductModal = ({showModal, product, onRefreshProducts, onClose}: DeleteProductModalProps) => {
    const submitFormRef = useRef<() => void | null>(null);

    const [refreshProducts, setRefreshProducts] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const handleShowAlertMessage = (
        message: string,
        isSuccess: boolean,
        isVisible: boolean
    ) => {
        setMessage(message);
        setIsSuccess(isSuccess);
        setIsVisible(isVisible);
    };

    const handleCloseAlertMessage = () => {
        setMessage("");
        setIsSuccess(false);
        setIsVisible(false);
    };

  return (
    <>
        <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex={-1} role='dialog'>
            <div className="modal-dialog" role='document'>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Remove this product from the inventory?</h5>
                    </div>
                    
                    <div className="modal-body">
                        <div className="mb-3">
                            <AlertMessage message={message} isSuccess={isSuccess} isVisible={isVisible} onClose={handleCloseAlertMessage} />
                        </div>
                        <h6>This action is irreversible!</h6>
                        <DeleteProductForm product={product} setSubmitForm={submitFormRef} setLoadingDelete={setLoadingDelete} onDeletedProduct={(message) => {
                                    handleShowAlertMessage(message, true, true);
                                    setRefreshProducts(!refreshProducts);
                                    onRefreshProducts(refreshProducts);
                                }}/>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" disabled={loadingDelete} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-danger" disabled={loadingDelete} onClick={() => submitFormRef.current?.()}>
                        {loadingDelete ? (
                                    <>
                                        <SmolSpinner /> Deleting...
                                    </>
                                ) : (
                                    "Yes, delete"
                                )}
                        </button>
                    </div>
                </div>
            </div>
        </div>    
    </>
  )
}

export default DeleteProductModal