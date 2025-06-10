import { useEffect } from "react";
import StocksTable from "../components/tables/StocksTable"
import MainLayout from "./layout/MainLayout";


const Stocks = () => {

  useEffect(() => {
    document.title = "Stock Monitoring";
  }, [])
  
  const content = (
    <>
        <div className="container mt-4">
            <div className="card shadow-sm rounded-lg p-3">
                <div className="card-body">
                    <h4 className="card-title text-center mb-3">Stocks Monitoring</h4>
                    <StocksTable refreshStocks />
                </div>
            </div>
        </div>
    </>
  );

  return <MainLayout content={content} />
}

export default Stocks