import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Products } from "../../interfaces/product/Products";
import ProductService from "../../../services/ProductService";
import ErrorHandler from "../../handler/ErrorHandler";
import type React from "react";

interface DeleteProductFormProps {
    product: Products | null;
    setSubmitForm: React.MutableRefObject<(() => void) | null>;
    setLoadingDelete: (loading: boolean) => void;
    onDeletedProduct: (message: string) => void;
}

const DeleteProductForm = ({ product, setSubmitForm, setLoadingDelete, onDeletedProduct }: DeleteProductFormProps) => {
    const [state, setState] = useState({
        product_id: 0,
        product_sku: "",
        product_name: "",
    });

    const HandleDeleteProduct = (e: FormEvent) => {
      e.preventDefault();
  
      setLoadingDelete(true);
  
      ProductService.DeleteProduct(state.product_id).then((res) => {
        if (res.status === 200) {
          onDeletedProduct(res.data.message);
        } else {
          console.error("Unexpected status error while deleting a product: ", res.status);
        }
      }).catch((error) => { ErrorHandler(error, null); }).finally(() => { setLoadingDelete(false); });
    };

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
      if (product) {
        setState((prevState) => ({
          ...prevState,
          product_id: product.product_id,
          product_sku: product.product_sku,
          product_name: product.product_name,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          product_id: 0,
          product_sku: "",
          product_name: "",
        }));
      };
      
      setSubmitForm.current = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
      };
    }, [product, setSubmitForm]);
    
  return (
    <>
      <form ref={formRef} onSubmit={HandleDeleteProduct}>
        <div className="row">
          <div className="d-flex justify-content-center">
            <div className="col-md-9">
                <div className="mb-3">
                  <label htmlFor="product_sku">SKU</label>
                  <input type="text" className="form-control" name="product_sku" id="product_sku" value={state.product_sku} readOnly/>
                  <label htmlFor="product_name">Product Name</label>
                  <input type="text" className="form-control" name="product_name" id="product_name" value={state.product_name} readOnly/>
                </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default DeleteProductForm