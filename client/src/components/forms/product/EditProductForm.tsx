import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductFieldErrors } from "../../interfaces/product/ProductFieldErrors";
import ProductService from "../../../services/ProductService";
import ErrorHandler from "../../handler/ErrorHandler";
import type { Products } from "../../interfaces/product/Products";
import type { Categories } from "../../interfaces/category/Categories";
import CategoryService from "../../../services/CategoryService";

interface EditProductFormProps {
  product: Products | null;
  setSubmitForm: React.RefObject<(() => void) | null>;
  setLoadingUpdate: (loading: boolean) => void;
  onUpdatedProduct: (message: string) => void;
}

const EditProductForm = ({ product, setSubmitForm, setLoadingUpdate, onUpdatedProduct }: EditProductFormProps) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [removeImageFlag, setRemoveImageFlag] = useState<boolean>(false);

  const [state, setState] = useState({
    loadingGet: true,
    loadingUpdate: false,
    loadingCategories: true,
    categories: [] as Categories[],
    product_id: 0,
    product_sku: "",
    product_name: "",
    category: "",
    product_price: 0,
    product_stocks: 0,
    product_min_threshold: 0,
    product_image: null as File | null,
    errors: {} as ProductFieldErrors,
  });

  const HandleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value) || 0;
    setState((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };

  const HandleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (["product_price", "product_stocks", "product_min_threshold"].includes(name)) {
      HandleNumberInputChange(e as ChangeEvent<HTMLInputElement>); // Cast to HTMLInputElement
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const HandleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setState((prevState) => ({
      ...prevState,
      product_image: file,
    }));
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
      setRemoveImageFlag(false);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const HandleRemoveImage = () => {
    setImagePreviewUrl(null);
    setRemoveImageFlag(true);
    setState((prevState) => ({
      ...prevState,
      product_image: null,
    }));
  };

  const HandleLoadCategories = () => {
    CategoryService.LoadCategories()
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            categories: res.data.categories,
          }));
        } else {
          console.error("Unexpected status error while loading categories: ", res.status);
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingCategories: false,
        }));
      });
  };

  const HandleUpdateProduct = (e: FormEvent) => {
    e.preventDefault();

    setLoadingUpdate(true);

    setState((prevState) => ({
      ...prevState,
      errors: {} as ProductFieldErrors,
    }));

    const formData = new FormData();
    formData.append('product_sku', state.product_sku);
    formData.append('product_name', state.product_name);
    formData.append('product_price', state.product_price.toString());
    formData.append('category', state.category); // category is already a string ID
    formData.append('product_stocks', state.product_stocks.toString());
    formData.append('product_min_threshold', state.product_min_threshold.toString());
    
    formData.append('_method', 'PUT'); 

    if (state.product_image) {
      formData.append('product_image', state.product_image);
    } else if (removeImageFlag) {
      formData.append('remove_image', '1');
    }

    ProductService.UpdateProduct(state.product_id, formData)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            errors: {} as ProductFieldErrors,
          }));
          onUpdatedProduct(res.data.message);
          setRemoveImageFlag(false);
        } else {
          console.error("Unexpected status error while updating a product: ", res.status);
        }
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setLoadingUpdate(false);
      });
  };

  const formRef = useRef<HTMLFormElement>(null);

  const GetProductImageUrl = () => {
    if (imagePreviewUrl) {
      return imagePreviewUrl;
    } else if (removeImageFlag) {
      return null;
    } else if (product?.product_image) {
      return `http://127.0.0.1:8000/storage/${product.product_image}`;
    }
    return null;
  };

  useEffect(() => {
    HandleLoadCategories();

    if (product) {
      setState((prevState) => ({
        ...prevState,
        product_id: product.product_id,
        product_sku: product.product_sku,
        product_name: product.product_name,
        category: product.category ? product.category.category_id.toString() : "",
        product_price: product.product_price,
        product_stocks: product.product_stocks,
        product_min_threshold: product.product_min_threshold,
        product_image: null,
        errors: {} as ProductFieldErrors,
      }));
      setImagePreviewUrl(product.product_image ? `http://127.0.0.1:8000/storage/${product.product_image}` : null);
      setRemoveImageFlag(false);
    } else {
      setState((prevState) => ({
        ...prevState,
        product_id: 0,
        product_sku: "",
        product_name: "",
        category: "",
        product_price: 0,
        product_stocks: 0,
        product_min_threshold: 0,
        product_image: null,
        errors: {} as ProductFieldErrors,
      }));
      setImagePreviewUrl(null);
      setRemoveImageFlag(false);
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
                <input type="number" className={`form-control ${state.errors.product_price ? "is-invalid" : ""}`} id="product_price" name="product_price" aria-describedby="Peso" value={state.product_price} onChange={HandleInputChange} />
                {state.errors.product_price && (
                  <p className="text-danger">{state.errors.product_price[0]}</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="product_name" className="form-label">Name/Description</label>
              <input type="text" className={`form-control ${state.errors.product_name ? "is-invalid" : ""}`} id="product_name" name="product_name" value={state.product_name} onChange={HandleInputChange} />
              {state.errors.product_name && (
                <p className="text-danger">{state.errors.product_name[0]}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="category">Category</label>
              <select className={`form-select ${state.errors.category ? "is-invalid" : ""}`} name="category" id="category" value={state.category} onChange={HandleInputChange}>
                <option value="">Select category</option>
                {state.loadingCategories ? (
                  <option value="">Loading...</option>
                ) : (
                  state.categories.map((category, index) => (
                    <option value={category.category_id} key={index}>
                      {category.category}
                    </option>
                  ))
                )}
              </select>
              {state.errors.category && (
                <span className="text-danger">{state.errors.category[0]}</span>
              )}
            </div>

            <div className="col-3 mb-3">
              <label htmlFor="product_stocks" className="form-label">Available Stocks</label>
              <input type="number" className={`form-control ${state.errors.product_stocks ? "is-invalid" : ""}`} id="product_stocks" name="product_stocks" value={state.product_stocks} onChange={HandleInputChange} />
              {state.errors.product_stocks && (
                <p className="text-danger">{state.errors.product_stocks[0]}</p>
              )}
            </div>

            <div className="col-3 mb-3">
              <label htmlFor="product_min_threshold" className="form-label">Minimum Threshold</label>
              <input type="number" className={`form-control ${state.errors.product_min_threshold ? "is-invalid" : ""}`} id="product_min_threshold" name="product_min_threshold" value={state.product_min_threshold} onChange={HandleInputChange} />
              {state.errors.product_min_threshold && (
                <p className="text-danger">{state.errors.product_min_threshold[0]}</p>
              )}
            </div>

            {/* <div className="col-6 mb-3">
                <label htmlFor="product_image" className="form-label">Product Image</label>
                <input type="file" className={`form-control ${state.errors.product_image ? "is-invalid" : ""}`} id="product_image" name="product_image" onChange={HandleFileInputChange} />
                {state.errors.product_image && (
                    <p className="text-danger">{state.errors.product_image[0]}</p>
                )}
                {GetProductImageUrl() && (
                    <div className="mt-2">
                        <img src={GetProductImageUrl() || ''} alt="Product Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={HandleRemoveImage}>
                            Remove Image
                        </button>
                    </div>
                )}
                {!GetProductImageUrl() && !removeImageFlag && product?.product_image && (
                    <div className="mt-2 text-muted">No current image selected.</div>
                )}
            </div> */}

          </div>
        </div>
      </form>
    </>
  );
};

export default EditProductForm;