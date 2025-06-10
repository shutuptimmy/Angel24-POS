import { useEffect, useState, useCallback } from 'react';
import OrderService from '../../services/OrderService'; 
import ErrorHandler from '../handler/ErrorHandler'; 
import type { Order } from '../interfaces/order/Order'; 
import AlertMessage from '../AlertMessage'; 
import Spinner from '../Spinner';

const PostOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
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

    const handleCloseAlertMessage = useCallback(() => {
        setMessage("");
        setIsSuccess(false);
        setIsVisible(false);
    }, []);

    const loadOrders = useCallback(() => { 
        setLoading(true);
        handleCloseAlertMessage(); 
        OrderService.LoadOrders()
            .then((fetchedOrders) => { 
                setOrders(fetchedOrders);
            })
            .catch((error: any) => {
                ErrorHandler(error, null);
                handleShowAlertMessage(error.response?.data?.message || "Failed to load orders. Please try again.", false, true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [handleCloseAlertMessage]);

    const handlePrintReceipt = useCallback((orderId: number) => { 
        handleCloseAlertMessage(); 
        OrderService.GetOrder(orderId)
            .then((detailedOrder) => { 
                if (!detailedOrder) {
                    handleShowAlertMessage("Failed to load order details for printing: Order not found.", false, true);
                    return;
                }

                // the print receipt thing is just simply screenshot of a pop-up page
                let receiptContent = `
                    <html>
                    <head>
                        <title>Receipt - Order ${detailedOrder.order_number}</title>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                        <style>
                            body { font-family: 'Arial', sans-serif; font-size: 12px; margin: 20px; }
                            .receipt-header { text-align: center; margin-bottom: 20px; }
                            .receipt-items table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                            .receipt-items th, .receipt-items td { border-bottom: 1px dashed #ccc; padding: 5px 0; text-align: left; }
                            .receipt-items th:nth-child(2), .receipt-items td:nth-child(2),
                            .receipt-items th:nth-child(3), .receipt-items td:nth-child(3),
                            .receipt-items th:nth-child(4), .receipt-items td:nth-child(4),
                            .receipt-items th:nth-child(5), .receipt-items td:nth-child(5) { text-align: right; }
                            .receipt-total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; }
                            .receipt-footer { text-align: center; margin-top: 30px; font-size: 0.9em; }
                        </style>
                    </head>
                    <body>
                        <div class="receipt-header">
                            <h4>Angels24 POS Receipt</h4>
                            <p>Order Number: <strong>${detailedOrder.order_number}</strong></p>
                            <p>Customer Name: ${detailedOrder.customer_name || 'Walk-in Customer'}</p>
                            <p>Date: ${new Date(detailedOrder.created_at).toLocaleString()}</p>
                        </div>
                        <div class="receipt-items">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th class="text-end">Qty</th>
                                        <th class="text-end">Price</th>
                                        <th class="text-end">Disc.</th>
                                        <th class="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${detailedOrder.product_orders?.map(item => `
                                        <tr>
                                            <td>${item.product_name}</td>
                                            <td class="text-end">${item.quantity}</td>
                                            <td class="text-end">₱${item.unit_price?.toFixed(2) || '0.00'}</td>
                                            <td class="text-end">${item.discount_percentage?.toFixed(2) || '0.00'}%</td>
                                            <td class="text-end">₱${item.subtotal_price?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                    `).join('') || '<tr><td colspan="5" class="text-center">No items found for this order.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                        <div class="receipt-total">
                            Grand Total: ₱${detailedOrder.total_price.toFixed(2)}
                        </div>
                        <div class="receipt-footer">
                            <p>Thank you for your purchase!</p>
                            <p>Powered by Angels24 POS</p>
                        </div>
                    </body>
                    </html>
                `;

                const printWindow = window.open('', '_blank', 'height=600,width=800');
                if (printWindow) {
                    printWindow.document.open();
                    printWindow.document.write(receiptContent);
                    printWindow.document.close();
                    printWindow.focus(); 
                    printWindow.print(); 
                } else {
                    handleShowAlertMessage('Could not open print window. Please allow pop-ups for this site.', false, true);
                }
            })
            .catch((error: any) => {
                ErrorHandler(error, null);
                handleShowAlertMessage(error.response?.data?.message || "Failed to load order details for receipt.", false, true);
            });
    }, [handleCloseAlertMessage]);


    useEffect(() => {
        document.title = "Transaction History";
        loadOrders();
    }, [loadOrders]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Transaction History</h2>
            <AlertMessage message={message} isSuccess={isSuccess} isVisible={isVisible} onClose={handleCloseAlertMessage} />
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order Number</th>
                                <th>Customer Name</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Order Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { loading ? (
                                <tr className="align-middle">
                                    <td colSpan={12} className="text-center"><Spinner /></td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.order_id}>
                                        <td>{order.order_id}</td>
                                        <td>{order.order_number}</td>
                                        <td>{order.customer_name || 'Walk-in Customer'}</td>
                                        <td>{order.total_quantity}</td>
                                        <td>₱{order.total_price.toFixed(2)}</td>
                                        <td>{new Date(order.created_at).toLocaleString()}</td>
                                        <td><button className="btn btn-primary btn-sm" onClick={() => handlePrintReceipt(order.order_id)}>Print Receipt</button></td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="text-center text-muted">No orders found.</td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default PostOrdersPage;