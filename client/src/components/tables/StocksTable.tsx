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
        <table className="table table-hover">
            <thead className="table-primary">
                <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Stocks Available</th>
                    <th>Threshold Value Alert</th>
                </tr>
            </thead>

            <tbody>
                {state.loadingStocks ? (
                    <tr className="align-middle">
                        <td colSpan={12} className="text-center"><Spinner /></td>
                    </tr>
                ) : state.products.length > 0 ? (
                    state.products.map((product, index) => {
                        if (product.product_stocks <= product.product_min_threshold) {
                            return (
                                <tr className="align-middle table-danger" key={index}>
                                    <td>{product.product_sku}</td>
                                    <td>{product.product_name}</td>
                                    <td className="fw-bold text-danger">{product.product_stocks}</td>
                                    <td>{product.product_min_threshold}</td>
                                </tr>
                            );
                        }
                        return (
                            <tr className="align-middle" key={index}>
                                <td>{product.product_sku}</td>
                                <td>{product.product_name}</td>
                                <td>{product.product_stocks}</td>
                                <td>{product.product_min_threshold}</td>
                            </tr>
                        );
                    })
                ) : (
                    <tr className="align-middle">
                        <td colSpan={12} className="text-center">No stocks for now</td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
  )
}

export default StocksTable