import { useRef, useState } from 'react';
import AddProductForm from '../../forms/product/AddProductForm'
import SmolSpinner from '../../SmolSpinner';
import AlertMessage from '../../AlertMessage';

interface AddProductModalProps {
    showModal: boolean;
    onRefreshProducts: (refresh: boolean) => void,
    onClose: () => void;
}

const AddProductModal = ({showModal, onRefreshProducts: onRefreshProduct, onClose}: AddProductModalProps) => {
    const submitFormRef = useRef<(() => void) | null>(null);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [loadingStore, setLoadingStore] = useState(false);

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
                        <h5 className="modal-title fs-5">Add New Product</h5>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <AlertMessage message={message} isSuccess={isSuccess} isVisible={isVisible} onClose={handleCloseAlertMessage}/>
                        </div>
                        <AddProductForm setSubmitForm={submitFormRef} setLoadingStore={setLoadingStore} onProductAdded={(message) => {
                            handleShowAlertMessage(message, true, true);
                            setRefreshProduct(!refreshProduct);
                            onRefreshProduct(refreshProduct);
                        }}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loadingStore} onClick={() => submitFormRef.current?.()}>
                            {loadingStore ? (
                                <>
                                    <SmolSpinner /> Saving Product...
                                </>
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default AddProductModal