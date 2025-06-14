import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import ProductService from "../../../services/ProductService";
import ErrorHandler from "../../handler/ErrorHandler";
import type {ProductFieldErrors} from "../../interfaces/product/ProductFieldErrors";
import type { Categories } from "../../interfaces/category/Categories";
import CategoryService from "../../../services/CategoryService";

interface AddProductFormProps {
  setSubmitForm: React.RefObject<(() => void) | null>;
  setLoadingStore: (loading: boolean) => void;
  onProductAdded: (message: string) => void;
}

const AddProductForm = ({setSubmitForm, setLoadingStore, onProductAdded}: AddProductFormProps) => {

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState({
    loadingStore: false,
    loadingCategories: true,
    categories: [] as Categories[],
    product_sku: '',
    product_name: '',
    category: '',
    product_price: 0,
    product_stocks: 0,
    product_min_threshold: 0,
    product_image: null as File | null,
    errors: {} as ProductFieldErrors
  });


  const HandleResetFields = () => {
    setState((prevstate) => ({
      ...prevstate,
      product_sku: '',
      product_name: '',
      category: '',
      product_price: 0,
      product_stocks: 0,
      product_min_threshold: 0,
      product_image: null,
      errors: {} as ProductFieldErrors
      
    }));
  
    setImagePreviewUrl(null);
    const imageInput = document.getElementById('product_image') as HTMLInputElement;
    if (imageInput) {
      imageInput.value = '';
    }
  }

  const HandleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const HandleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setState((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: null,
      }));
      setImagePreviewUrl(null);
    }
  };

  const HandleLoadCategories = () => {
    CategoryService.LoadCategories()
        .then((res) => {
            if (res.status === 200) {
                setState((prevState) => ({
                    ...prevState,
                    categories: res.data.categories,
                }));
            } else { console.error("Unexpected status error while loading categories: ", res.status); }
        }).catch((error) => { ErrorHandler(error, null); }).finally(() => {
            setState((prevState) => ({
                ...prevState,
                loadingCategories: false,
            }));
        });
  };
    
  const HandleStoreProduct = (e: FormEvent) => {
    e.preventDefault();
    setLoadingStore(true);

    const formData = new FormData();
    formData.append('product_sku', state.product_sku);
    formData.append('product_name', state.product_name);
    formData.append('product_price', state.product_price.toString());
    formData.append('category', state.category);
    formData.append('product_stocks', state.product_stocks.toString());
    formData.append('product_min_threshold', state.product_min_threshold.toString());

    if (state.product_image) {
      formData.append('product_image', state.product_image);
    }

    ProductService.StoreProduct(formData).then((res) => {
      if (res.status == 200) {
        HandleResetFields();
        onProductAdded(res.data.message);

      } else {
        console.error("An error occured when adding new product: ", res.status)
      }
    }).catch((error) => {
      if (error.response.status === 422) {
        setState((prevState) => ({
          ...prevState,
          errors: error.response.data.errors,
        }))
      } else {
        ErrorHandler(error, null)
      }
    }).finally(() => {
      setLoadingStore(false);
      }
    );
  };

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    HandleLoadCategories();

    setSubmitForm.current = () => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  }, [setSubmitForm])

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <>
    <form ref={formRef} onSubmit={HandleStoreProduct}>  
      <div className="form-group">
        <div className="row">
          <div className="col-6 mb-3">
            <label htmlFor="product_sku" className="form-label">SKU</label>
            <input type="text" className={`form-control ${state.errors.product_sku ? "is-invalid" : ""}`} id="product_sku" name="product_sku" value={state.product_sku} onChange={HandleInputChange}/>
            <div className="form-text">Every product should be unique for barcode scanning.</div>
            {state.errors.product_sku && (
              <span className="text-danger">{state.errors.product_sku[0]}</span>
            )}
          </div>

          <div className="col-4 mb-3">
            <label htmlFor="product_price" className="form-label">Price</label>
            <div className="input-group">
              <span className="input-group-text" id="Peso">₱</span>
              <input type="number" className="form-control" id="product_price" name="product_price" aria-describedby="Peso" value={state.product_price} onChange={HandleInputChange}/>
              {state.errors.product_price && (
              <span className="text-danger">{state.errors.product_price[0]}</span>
            )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="product_name" className="form-label">Name/Description</label>
            <input type="text" className="form-control" id="product_name" name="product_name" value={state.product_name} onChange={HandleInputChange}/>
            {state.errors.product_name && (
              <span className="text-danger">{state.errors.product_name[0]}</span>
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
            <input type="number" className="form-control" id="product_stocks" name="product_stocks" value={state.product_stocks} onChange={HandleInputChange}/>
            {state.errors.product_stocks && (
              <span className="text-danger">{state.errors.product_stocks[0]}</span>
            )}
          </div>

          <div className="col-3 mb-3">
            <label htmlFor="product_min_threshold" className="form-label">Minimum Threshold</label>
            <input type="number" className="form-control" id="product_min_threshold" name="product_min_threshold" value={state.product_min_threshold} onChange={HandleInputChange}/>
            {state.errors.product_min_threshold && (
              <span className="text-danger">{state.errors.product_min_threshold[0]}</span>
            )}
          </div>

          {/* <div className="mb-3">
              <label htmlFor="product_image" className="form-label">Product Image</label>
              <input
                type="file"
                className={`form-control ${state.errors.product_image ? "is-invalid" : ""}`}
                id="product_image"
                name="product_image"
                accept="image/*"
                onChange={HandleFileInputChange}
              />
              {state.errors.product_image && (
                <span className="text-danger">{state.errors.product_image[0]}</span>
              )}
              {imagePreviewUrl && (
                <div className="mt-2">
                  <img
                    src={imagePreviewUrl}
                    alt="Product Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ddd', padding: '5px' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </div> */}
        </div>
      </div>
    </form>
    </>
  )
}

export default AddProductForm