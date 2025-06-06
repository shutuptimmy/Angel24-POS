import { useEffect, useState } from "react";
import AddProductModal from "../../components/modals/product/AddProductModal";
import ProductsTable from "../../components/tables/ProductsTable";
import MainLayout from "../layout/MainLayout";
import type { Products } from "../../components/interfaces/product/Products";
import EditProductModal from "../../components/modals/product/EditProductModal";
import DeleteProductModal from "../../components/modals/product/DeleteProductModal";

const Products = () => {
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);

  const HandleOpenEditUserModal = (product: Products) => {
    setSelectedProduct(product);
    setOpenEditProductModal(true);
  };
  const HandleCloseEditUserModal = () => {
      setSelectedProduct(null);
      setOpenEditProductModal(false);
  };

  const HandleOpenDeleteUserModal = (product: Products) => {
      setSelectedProduct(product);
      setOpenDeleteProductModal(true);
  };
  const HandleCloseDeleteUserModal = () => {
      setSelectedProduct(null);
      setOpenDeleteProductModal(false);
  };

  useEffect(() => {
  document.title = "Inventory Management";
  }, [])

  const content = (
    <>
        <div className="row justify-content-center align-items-center">
            <div className="col">
                <AddProductModal showModal={openAddProductModal} onClose={() => setOpenAddProductModal(false)} onRefreshProducts={() => setRefreshProducts(!refreshProducts)}/>
                <EditProductModal showModal={openEditProductModal} product={selectedProduct} onClose={HandleCloseEditUserModal} onRefreshProducts={() => setRefreshProducts(!refreshProducts)}/>
                <DeleteProductModal showModal={openDeleteProductModal} product={selectedProduct} onClose={HandleCloseDeleteUserModal} onRefreshProducts={() => setRefreshProducts(!refreshProducts)}/>
                  <b>Product Details</b>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={() => setOpenAddProductModal(true)}>Add New Product</button>
                  </div>
                <ProductsTable refreshProducts={refreshProducts} onEditProduct={HandleOpenEditUserModal} onDeleteProduct={HandleOpenDeleteUserModal}/>
            </div>
        </div>
        
    </>
  );

  return <MainLayout content={content} />;
}

export default Products