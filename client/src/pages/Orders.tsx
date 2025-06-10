import TransactionsTable from "../components/tables/TransactionsTable"
import MainLayout from "./layout/MainLayout";

const Orders = () => {
  const content = (
    <>
        <TransactionsTable />
    </>
  );

  return <MainLayout content={content} />
}

export default Orders