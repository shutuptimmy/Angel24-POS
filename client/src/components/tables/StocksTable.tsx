import { useEffect, useState } from "react";
import type { Products } from "../interfaces/product/Products";
import ProductService from "../../services/ProductService";
import ErrorHandler from "../handler/ErrorHandler";
import Spinner from "../Spinner";

interface StocksTableProps {
    refreshStocks: boolean;
}

const StocksTable = ({refreshStocks}: StocksTableProps) => {

    const [state, setState] = useState({
        loadingStocks: true,
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
              loadingStocks: false,
            }));
          });
      };
    
      useEffect(() => {
        HandleLoadProducts();
      }, [refreshStocks]);

  return (
    <>
        <div className="table-responsive">
            <table className="table table-hover align-middle">
                <thead className="table-primary">
                    <tr>
                        <th scope="col">SKU</th>
                        <th scope="col">Name</th>
                        <th scope="col">Stocks Available</th>
                        <th scope="col">Threshold Alert</th>
                    </tr>
                </thead>
                <tbody>
                    {state.loadingStocks ? (
                        <tr className="text-center">
                            <td colSpan={4}><Spinner /></td>
                        </tr>
                    ) : state.products.length > 0 ? (
                        state.products.map((product) => {
                            const isBelowThreshold = product.product_stocks <= product.product_min_threshold;
                            return (
                                <tr className={isBelowThreshold ? "table-danger" : ""} key={product.product_id}>
                                    <td>{product.product_sku}</td>
                                    <td>{product.product_name}</td>
                                    <td className={isBelowThreshold ? "fw-bold text-danger" : ""}>{product.product_stocks}</td>
                                    <td>{product.product_min_threshold}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr className="text-center">
                            <td colSpan={4} className="text-muted">No stocks for now</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
  )
}

export default StocksTable