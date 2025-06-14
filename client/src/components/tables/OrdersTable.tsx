interface LocalCartItem {
    localId: string;
    product_id: number;
    product_name: string;
    unit_price: number;
    quantity: number;
    discount_percentage: number;
    subtotal_price: number;
}

interface OrdersTableProps {
    items: LocalCartItem[];
    onRemoveItem: (localId: string) => void;
}

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