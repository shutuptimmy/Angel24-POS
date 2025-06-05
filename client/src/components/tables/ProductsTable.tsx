import { useEffect, useState } from "react";
import type { Products } from "../interfaces/product/Products";
import ProductService from "../../services/ProductService";
import ErrorHandler from "../handler/ErrorHandler";
import Spinner from "../Spinner";

interface ProductsTableProps {
    refreshProducts: boolean;
    onEditProduct: (user: Products) => void;
    onDeleteProduct: (user: Products) => void;
}

const ProductsTable = ({refreshProducts, onEditProduct, onDeleteProduct}: ProductsTableProps) => {
    const [state, setState] = useState({
        loadingProducts: false,
        products: [] as Products[]
    })

    const HandleLoadProducts = () => {
        ProductService.LoadProducts().then((res) => {
            if (res.status === 200) {
              setState((prevState) => ({
                ...prevState,
                products: res.data.products,
              }));
            } else {
              console.error("Unexpected status error during loading products: ", res.status);
            }
          }).catch((error) => {ErrorHandler(error, null);}).finally(() => {
            setState((prevState) => ({
              ...prevState,
              loadingProducts: false,
            }));
          });
      };
    
      useEffect(() => {
        HandleLoadProducts();
      }, [refreshProducts]);

  return (
    <>
        <table className="table table-hover">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Price (₱)</th>
                        <th>Date Added</th>
                        <th>Date Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.loadingProducts ? (
                        <tr className="align-middle">
                            <td colSpan={3} className="text-center"><Spinner /></td>
                        </tr>
                    ) : state.products.length > 0 ? (
                        state.products.map((product, index) => (
                            <tr className="align-middle" key={index}>
                                <td>{product.product_sku}</td>
                                <td>{product.product_name}</td>
                                <td>{product.product_price}</td>
                                <td>{product.created_at}</td>
                                <td>{product.updated_at}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-success" onClick={() => onEditProduct(product)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => onDeleteProduct(product)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                      <tr className="align-middle">
                        <td colSpan={8} className="text-center">
                            No Products Found
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>    
    </>
  )
}

export default ProductsTable