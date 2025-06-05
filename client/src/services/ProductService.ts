import AxiosInstance from "../AxiosInstance"

const ProductService = {
    LoadProducts: async () => {
        return AxiosInstance.get("/LoadProducts")
          .then((response) => response)
          .catch((error) => {
            throw error;
          });
      },

    GetProduct: async (productId: number) => {
        return AxiosInstance.get(`/GetProduct/${productId}`).then((response) => response).catch((error) => { throw error; });
    },

    StoreProduct: async (data: any) => {
        return AxiosInstance.post('/StoreProduct', data).then((response) => response).catch((error) => {throw error});
    },

    UpdateProduct: async (productId: number, data: any) => {
      return AxiosInstance.put(`/UpdateProduct/${productId}`, data).then((response) => response).catch((error) => { throw error; });
  },

    DeleteProduct: async (productId: number) => {
      return AxiosInstance.put(`/DeleteProduct/${productId}`).then((response) => response).catch((error) => { throw error; });
  },
}

export default ProductService