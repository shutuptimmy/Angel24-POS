import StocksTable from "../../components/tables/StocksTable"
import MainLayout from "../layout/MainLayout";

const Stocks = () => {
  const content = (
    <>
        <StocksTable />
    </>
  );

  return <MainLayout content={content} />
}

export default Stocks