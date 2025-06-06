import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductFieldErrors } from "../../interfaces/product/ProductFieldErrors";
import ProductService from "../../../services/ProductService";
import ErrorHandler from "../../handler/ErrorHandler";
import type { Products } from "../../interfaces/product/Products";

interface EditProductFormProps {
  product: Products | null;
  setSubmitForm: React.RefObject<(() => void) | null>;
  setLoadingUpdate: (loading: boolean) => void;
  onUpdatedProduct: (message: string) => void;
}

const EditProductForm = ({ product, setSubmitForm, setLoadingUpdate, onUpdatedProduct }: EditProductFormProps) => {
  const [state, setState] = useState({
    loadingGet: true,
    loadingUpdate: false,
    product_id: 0,
    product_sku: "",
    product_name: "",
    product_price: 0,
    product_stocks: 0,
    product_min_threshold: 0,
    errors: {} as ProductFieldErrors,
  });

  const HandleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const HandleUpdateProduct = (e: FormEvent) => {
    e.preventDefault();

    setLoadingUpdate(true);

    ProductService.UpdateProduct(state.product_id, state).then((res) => {
      if (res.status === 200) {
        setState((prevState) => ({
          ...prevState,
          errors: {} as ProductFieldErrors,
        }));
        onUpdatedProduct(res.data.message);
      } else {
        console.error("Unexpected status error while updating a product: ", res.status);
      }
    }).catch((error) => {
      if (error.response.status === 422) {
        setState((prevState) => ({
          ...prevState,
          errors: error.response.data.errors,
        }));
      } else { ErrorHandler(error, null); }
    }).finally(() => {
      setLoadingUpdate(false);
    });
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (product) {
      setState((prevState) => ({
        ...prevState,
        product_id: product.product_id,
        product_sku: product.product_sku,
        product_name: product.product_name,
        product_price: product.product_price,
        product_stocks: product.product_stocks,
        product_min_threshold: product.product_min_threshold,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        product_id: 0,
        product_sku: "",
        product_name: "",
        product_price: 0,
        product_stocks: 0,
        product_min_threshold: 0,
        errors: {} as ProductFieldErrors
      }));
    }

    setSubmitForm.current = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    };
  }, [product, setSubmitForm]);

  return (
    <>
      <form ref={formRef} onSubmit={HandleUpdateProduct}>
        <div className="form-group">
          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="product_sku" className="form-label">SKU</label>
              <input type="text" className={`form-control ${state.errors.product_sku ? "is-invalid" : ""}`} id="product_sku" name="product_sku" value={state.product_sku} onChange={HandleInputChange} />
              <div className="form-text">Every product should be unique for barcode scanning.</div>
              {state.errors.product_sku && (
                <p className="text-danger">{state.errors.product_sku[0]}</p>
              )}
            </div>

            <div className="col-4 mb-3">
              <label htmlFor="product_price" className="form-label">Price</label>
              <div className="input-group">
                <span className="input-group-text" id="Peso">₱</span>
                <input type="text" className="form-control" id="product_price" name="product_price" aria-describedby="Peso" value={state.product_price} onChange={HandleInputChange} />
                {state.errors.product_price && (
                  <p className="text-danger">{state.errors.product_price[0]}</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="product_name" className="form-label">Name/Description</label>
              <input type="text" className="form-control" id="product_name" name="product_name" value={state.product_name} onChange={HandleInputChange} />
              {state.errors.product_name && (
                <p className="text-danger">{state.errors.product_name[0]}</p>
              )}
            </div>

            <div className="col-3 mb-3">
              <label htmlFor="product_stocks" className="form-label">Available Stocks</label>
              <input type="text" className="form-control" id="product_stocks" name="product_stocks" value={state.product_stocks} onChange={HandleInputChange}/>
              {state.errors.product_stocks && (
                <p className="text-danger">{state.errors.product_stocks[0]}</p>
              )}
            </div>

            <div className="col-3 mb-3">
              <label htmlFor="product_min_threshold" className="form-label">Minimum Threshold</label>
              <input type="text" className="form-control" id="product_min_threshold" name="product_min_threshold" value={state.product_min_threshold} onChange={HandleInputChange}/>
              {state.errors.product_min_threshold && (
                <p className="text-danger">{state.errors.product_min_threshold[0]}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
export default EditProductForm