import { useEffect, useState } from "react";
import type { Products } from "../interfaces/product/Products";
import ProductService from "../../services/ProductService";
import ErrorHandler from "../handler/ErrorHandler";
import Spinner from "../Spinner";
// import Placeholder from "../../assets/angels24-placeholder.png"

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
      
    // const GetProductImageUrl = (imagePath: string | null): string => {
    //     if (imagePath) {
    //         const image = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    //         return `http://localhost:8000/storage/${image}`;
    //     }
    //     return Placeholder;
    // };
    
  return (
    <>
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">SKU</th>
                        <th scope="col">Category</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price (₱)</th>
                        <th scope="col">Stocks</th>
                        <th scope="col">Min Threshold</th>
                        <th scope="col">Date Added</th>
                        <th scope="col">Date Updated</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {state.loadingProducts ? (
                        <tr className="text-center">
                            <td colSpan={10}><Spinner /></td>
                        </tr>
                    ) : state.products.length > 0 ? (
                        state.products.map((product) => (
                            <tr key={product.product_id}>
                                {/* <td>
                                    <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '5px' }}>
                                        <img src={GetProductImageUrl(product.product_image)} alt={product.product_name} className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                                    </div>
                                </td> */}
                                <td>{product.product_id}</td>
                                <td>{product.product_sku}</td>
                                <td>{product.category.category}</td>
                                <td>{product.product_name}</td>
                                <td>{product.product_price.toFixed(2)}</td>
                                <td>{product.product_stocks}</td>
                                <td>{product.product_min_threshold}</td>
                                <td>{new Date(product.created_at).toLocaleString()}</td>
                                <td>{new Date(product.updated_at).toLocaleString()}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-success btn-sm" onClick={() => onEditProduct(product)}>Manage</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => onDeleteProduct(product)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="text-center">
                            <td colSpan={10} className="text-muted">No Products Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
  )
}

export default ProductsTable