import { useRef, useState } from 'react';
import EditProductForm from '../../forms/product/EditProductForm'
import type { Products } from '../../interfaces/product/Products';
import AlertMessage from '../../AlertMessage';
import SmolSpinner from '../../SmolSpinner';

interface EditProductModalProps {
    showModal: boolean;
    product: Products | null;
    onRefreshProducts: (refresh: boolean) => void;
    onClose: () => void;
}

const EditProductModal = ({showModal, product, onRefreshProducts, onClose}: EditProductModalProps) => {
        const submitFormRef = useRef<() => void | null>(null);

    const [refreshProducts, setRefreshProducts] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

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
                        <h5 className="modal-title fs-5">Edit Product</h5>
                    </div>
                    <div className="modal-body">
                    <div className="mb-3">
                        <AlertMessage message={message} isSuccess={isSuccess} isVisible={isVisible} onClose={handleCloseAlertMessage}/>
                    </div>
                        <EditProductForm product={product} setSubmitForm={submitFormRef} setLoadingUpdate={setLoadingUpdate} onUpdatedProduct={(message) => {
                                    handleShowAlertMessage(message, true, true);
                                    setRefreshProducts(!refreshProducts);
                                    onRefreshProducts(refreshProducts);
                                }}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" disabled={loadingUpdate} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-success" disabled={loadingUpdate} onClick={() => submitFormRef.current?.()}>
                            {loadingUpdate ? (
                                <>
                                    <SmolSpinner /> Saving Changes...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default EditProductModal