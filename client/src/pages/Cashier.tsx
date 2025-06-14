import { useEffect, useState, type ChangeEvent, useCallback, useRef } from "react";
import type { AxiosResponse } from 'axios'; 

import BigLogo from "../assets/angels24-icon.png"; 
import Background from "../assets/bg.png"; 
import ProductService from "../services/ProductService"; 
import OrderService from "../services/OrderService"; 
import type { StoreOrderPayload } from "../components/interfaces/order/StoreOrderPayload";
import type { StoreOrderResponse } from "../components/interfaces/order/StoreOrderResponse";
import ErrorHandler from "../components/handler/ErrorHandler"; 
import type { Products } from "../components/interfaces/product/Products"; 

import OrdersTable from "../components/tables/OrdersTable"; 
import AlertMessage from "../components/AlertMessage"; 
import type { LocalCartItem } from "../components/interfaces/order/LocalCartItem";
import SmolSpinner from "../components/SmolSpinner";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


const Cashier = () => {
    const [customerName, setCustomerName] = useState<string>("");
    const [availableProducts, setAvailableProducts] = useState<Products[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Products[]>([]); 
    const [searchTerm, setSearchTerm] = useState<string>(""); 
    
    const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
    const [itemQuantity, setItemQuantity] = useState<number>(1);
    const [itemDiscount, setItemDiscount] = useState<number>(0);
    const [currentItemSubtotal, setCurrentItemSubtotal] = useState<number>(0);

    const [currentOrderItems, setCurrentOrderItems] = useState<LocalCartItem[]>([]);
    const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0);

    const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
    const [processingOrder, setProcessingOrder] = useState<boolean>(false);

    const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);
    
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

    const searchInputRef = useRef<HTMLInputElement>(null); 

    const CashierBg = {
        header: {
            backgroundImage: `url(${Background})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: `100vh`,
        },
        content: {
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: '20px' 
        }
    };

    const calculateCurrentItemSubtotal = useCallback(() => {
        if (selectedProduct) {
            const price = selectedProduct.product_price;
            const qty = itemQuantity;
            const userDiscount = itemDiscount; 

            let subtotal = price * qty;
            if (userDiscount > 0) {
                subtotal -= (subtotal * userDiscount) / 100;
            }
            setCurrentItemSubtotal(parseFloat(subtotal.toFixed(2))); 
        } else {
            setCurrentItemSubtotal(0);
        }
    }, [selectedProduct, itemQuantity, itemDiscount]); 

    const calculateTotalOrderPrice = useCallback(() => {
        const total = currentOrderItems.reduce((acc, item) => acc + item.subtotal_price, 0);
        setTotalOrderPrice(parseFloat(total.toFixed(2)));
    }, [currentOrderItems]);

    const handleCustomerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomerName(e.target.value);
    };

    const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 0) {
            const filtered = availableProducts.filter(product =>
                product.product_name.toLowerCase().includes(term.toLowerCase()) ||
                product.product_sku.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
        if (selectedProduct && selectedProduct.product_name !== term && selectedProduct.product_sku !== term) {
            setSelectedProduct(null);
            setCurrentItemSubtotal(0);
        }
    };

    const handleProductSelect = (product: Products) => {
        setSelectedProduct(product);
        setSearchTerm(product.product_name); 
        setFilteredProducts([]); 
        handleCloseAlertMessage(); 
    };

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setItemQuantity(isNaN(value) || value < 1 ? 1 : value); 
    };

    const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setItemDiscount(isNaN(value) || value < 0 ? 0 : (value > 100 ? 100 : value)); 
    };

    // senior citizen checkbox toggle
    const handleSeniorCitizenToggle = (e: ChangeEvent<HTMLInputElement>) => {
        setIsSeniorCitizen(e.target.checked);
    };

    const handleAddProductToOrder = () => {
        if (!selectedProduct) {
            handleShowAlertMessage("Please select a product to add.", false, true);
            return;
        }
        if (itemQuantity < 1) {
            handleShowAlertMessage("Quantity must be at least 1.", false, true);
            return;
        }
        const currentProductData = availableProducts.find(p => p.product_id === selectedProduct.product_id);
        const currentStock = currentProductData ? currentProductData.product_stocks : 0;

        if (currentStock < itemQuantity) {
            handleShowAlertMessage(`Not enough stock for ${selectedProduct.product_name}. Available: ${currentStock}`, false, true);
            return;
        }

        const newItem: LocalCartItem = {
            localId: Date.now().toString() + Math.random().toString(36).substring(2, 9), 
            product_id: selectedProduct.product_id,
            product_name: selectedProduct.product_name,
            unit_price: selectedProduct.product_price,
            quantity: itemQuantity,
            discount_percentage: itemDiscount, 
            subtotal_price: currentItemSubtotal, 
        };

        setCurrentOrderItems(prevItems => [
            ...prevItems, 
            newItem
        ]);
        
        setSelectedProduct(null);
        setItemQuantity(1);
        setItemDiscount(0); 
        setCurrentItemSubtotal(0);
        setSearchTerm("");
        handleCloseAlertMessage(); 
        if (searchInputRef.current) {
            searchInputRef.current.focus(); 
        }
    };

    const handleRemoveProductFromOrder = (localId: string) => {
        setCurrentOrderItems(prevItems => prevItems.filter(item => item.localId !== localId));
    };

    const handleProcessTransaction = async () => {
        if (currentOrderItems.length === 0) {
            handleShowAlertMessage("Please add products to the order before processing the transaction.", false, true);
            return;
        }

        setProcessingOrder(true);
        handleCloseAlertMessage(); 

        const payload: StoreOrderPayload = {
            customer_name: customerName || "Walk-in Customer", 
            is_senior_citizen: isSeniorCitizen, 
            products: currentOrderItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                discount_percentage: item.discount_percentage, 
            })),
        };

        OrderService.StoreOrder(payload)
            .then((responseData: StoreOrderResponse) => { 
                if (responseData && responseData.order_id) { 
                    handleShowAlertMessage(`Order ${responseData.order_number} processed! Total: ₱${responseData.total_price.toFixed(2)}`, true, true);
                    setCustomerName("Walk-in Customer");
                    setCurrentOrderItems([]);
                    setTotalOrderPrice(0);
                    setIsSeniorCitizen(false); 
                    loadAllProducts(); 
                } else {
                    handleShowAlertMessage("Order processed, but response data has unexpected error.", false, true);
                }
            })
            .catch((error: any) => {
                ErrorHandler(error, null); 
                handleShowAlertMessage(error.response?.data?.message || "Failed to process order. Please try again.", false, true);
            })
            .finally(() => {
                setProcessingOrder(false);
            });
    };

    const loadAllProducts = useCallback(() => { 
        setLoadingProducts(true);
        ProductService.LoadProducts()
            .then((response: AxiosResponse<{ products: Products[] }>) => { 
                setAvailableProducts(response.data.products); 
            })
            .catch((error) => {
                ErrorHandler(error, null);
                handleShowAlertMessage("Failed to load products. Please refresh the page.", false, true);
            })
            .finally(() => {
                setLoadingProducts(false);
            });
    }, []); 

    useEffect(() => {
        loadAllProducts();
        document.title = "Cashier"; 
    }, [loadAllProducts]);

    useEffect(() => {
        calculateCurrentItemSubtotal();
    }, [calculateCurrentItemSubtotal]);

    useEffect(() => {
        calculateTotalOrderPrice();
    }, [calculateTotalOrderPrice]);

    return (
        <div style={CashierBg.header}>
            <div style={CashierBg.content}>
                <Navbar />

                <div className="container-fluid mt-3"> 
                    <AlertMessage message={message} isSuccess={isSuccess} isVisible={isVisible} onClose={handleCloseAlertMessage} />
                            
                    <div className="card mb-3 shadow-sm">
                        <div className="card-header">
                            <img src={BigLogo} className="img-fluid mx-auto d-block w-auto" alt="angels24" />
                        </div>

                        <div className="card-body">
                            <div className="col-10 mb-3">
                                <label htmlFor="customerName" className="form-label">Customer Name</label>
                                <input type="text" className="form-control" id="customerName" value={customerName} onChange={handleCustomerNameChange} placeholder="Leave empty for Walk-in Customer"/>
                            </div>
                            <div className="form-check pb-2">
                                <input className="form-check-input" type="checkbox" id="seniorCitizenCheck" checked={isSeniorCitizen} onChange={handleSeniorCitizenToggle}/>
                                <label className="form-check-label" htmlFor="seniorCitizenCheck">Senior Citizen? (Applies additional 10% after transaction)</label>
                            </div>


                            <div className="row g-3">
                                <div className="col-md-6 position-relative">
                                    <label htmlFor="productSearch" className="form-label">Product Name / SKU</label>
                                    <input type="text" className="form-control" id="productSearch" ref={searchInputRef} value={searchTerm} onChange={handleSearchTermChange} placeholder="SKU / Product name" autoComplete="off" disabled={loadingProducts}/>
                                    {searchTerm.length > 0 && filteredProducts.length > 0 && !selectedProduct && (
                                        <ul className="list-group position-absolute w-100 shadow" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                                            {filteredProducts.map(product => (
                                                <li key={product.product_id} className="list-group-item list-group-item-action" onClick={() => handleProductSelect(product)} style={{ cursor: 'pointer' }}>
                                                    {product.product_name} (SKU: {product.product_sku}) - ₱{product.product_price.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {loadingProducts && <small className="form-text text-muted">Loading products...</small>}
                                    {selectedProduct && (
                                        <div className="mt-2">
                                            Selected: <strong>{selectedProduct.product_name}</strong> (SKU: {selectedProduct.product_sku})
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-2">
                                    <label htmlFor="productPrice" className="form-label">Price</label>
                                    <div className="input-group">
                                        <span className="input-group-text">₱</span>
                                        <input type="text" className="form-control" id="productPrice" value={selectedProduct ? selectedProduct.product_price.toFixed(2) : ''} readOnly disabled/>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <label htmlFor="itemQuantity" className="form-label">Quantity</label>
                                    <input type="number" className="form-control" id="itemQuantity" value={itemQuantity} onChange={handleQuantityChange} min="1" disabled={!selectedProduct}/>
                                </div>

                                <div className="col-md-2">
                                    <label htmlFor="itemDiscount" className="form-label">Product Discount (%)</label> 
                                    <input type="number" className="form-control" id="itemDiscount" value={itemDiscount} onChange={handleDiscountChange} min="0" max="100" disabled={!selectedProduct}/>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="currentItemSubtotal" className="form-label">Subtotal</label>
                                    <div className="input-group">
                                        <span className="input-group-text">₱</span>
                                        <input type="text" className="form-control" id="currentItemSubtotal" value={currentItemSubtotal.toFixed(2)} readOnly disabled/>
                                    </div>
                                </div>
                                <div className="col-md-4 d-flex align-items-end"> 
                                    <button type="button" className="btn btn-primary w-100" onClick={handleAddProductToOrder} disabled={!selectedProduct || itemQuantity < 1 || currentItemSubtotal <= 0}>Add Product</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-3 shadow-sm">
                        <div className="card-header bg-primary fw-bold text-white text-center">Current Order</div>
                        <div className="card-body">
                            <OrdersTable items={currentOrderItems} onRemoveItem={handleRemoveProductFromOrder} />
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body d-flex justify-content-between align-items-center bg-light">
                            <h4 className="mb-0">Total: ₱{totalOrderPrice.toFixed(2)}</h4>
                            <Link className="btn btn-primary btn-lg" to={'/feedback'}>Feedback</Link>
                            <button type="button" className="btn btn-success btn-lg" onClick={handleProcessTransaction} disabled={currentOrderItems.length === 0 || processingOrder}>
                                {processingOrder ? (
                                <>
                                    <SmolSpinner /> Processing...
                                </>
                                ) : (
                                    "Process Transcation"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cashier;