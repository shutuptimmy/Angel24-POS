// Interface for items in the local cart state
interface LocalCartItem {
    localId: string; // Unique ID for React key prop and easy removal from cart
    product_id: number;
    product_name: string;
    unit_price: number; // Price of the product when added
    quantity: number;
    discount_percentage: number; // Discount applied to this specific item
    subtotal_price: number; // Calculated subtotal for this cart item
}

// Props for the OrdersTable component
interface OrdersTableProps {
    items: LocalCartItem[];
    onRemoveItem: (localId: string) => void;
}

/**
 * OrdersTable component displays the list of products added to the current order (the cart).
 * It shows details like product name, quantity, price, discount, subtotal, and an action to remove items.
 */
const OrdersTable = ({ items, onRemoveItem }: OrdersTableProps) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Qty.</th>
                        <th>Price</th>
                        <th>Discount (%)</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">No products added to the order yet.</td>
                        </tr>
                    ) : (
                        items.map((item) => (
                            <tr key={item.localId} className="align-middle">
                                <td>{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>₱{item.unit_price.toFixed(2)}</td>
                                <td>{item.discount_percentage.toFixed(2)}%</td>
                                <td>₱{item.subtotal_price.toFixed(2)}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => onRemoveItem(item.localId)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;