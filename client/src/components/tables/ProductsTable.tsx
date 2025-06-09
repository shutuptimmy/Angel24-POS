import { useEffect, useState } from "react";
import type { Products } from "../interfaces/product/Products";
import ProductService from "../../services/ProductService";
import ErrorHandler from "../handler/ErrorHandler";
import Spinner from "../Spinner";

interface ProductsTableProps {
    refreshProducts: boolean;
    onEditProduct: (product: Products) => void;
    onDeleteProduct: (product: Products) => void;
}

const ProductsTable = ({refreshProducts, onEditProduct, onDeleteProduct}: ProductsTableProps) => {
    const [state, setState] = useState({
        loadingProducts: true,
        products: [] as Products[]
    });

    
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
      
      const PLACEHOLDER_IMAGE_URL = '/images/placeholder-product.png';

    const GetProductImageUrl = (imagePath: string | null): string => {
        if (imagePath) {
            const cleanedPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
            return `http://localhost:8000/storage/${cleanedPath}`;
        }
        return PLACEHOLDER_IMAGE_URL;
    };
    
  return (
    <>
        <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Image</th>
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
                            <td colSpan={12} className="text-center"><Spinner /></td>
                        </tr>
                    ) : state.products.length > 0 ? (
                        state.products.map((product) => (
                            <tr className="align-middle" key={product.product_id}>
                                <td><img src={GetProductImageUrl(product.product_image)} alt={product.product_name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}className="img-thumbnail"/></td>
                                <td>{product.product_sku}</td>
                                <td>{product.product_name}</td>
                                <td>{product.product_price}</td>
                                <td>{product.created_at}</td>
                                <td>{product.updated_at}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-success" onClick={() => onEditProduct(product)}>Manage</button>
                                        <button className="btn btn-danger" onClick={() => onDeleteProduct(product)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                      <tr className="align-middle">
                        <td colSpan={12} className="text-center">
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