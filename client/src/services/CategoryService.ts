import AxiosInstance from "../AxiosInstance";

const CategoryService = {
    LoadCategories: async () => {
        return AxiosInstance.get('/LoadCategories').then((response) => response).catch((error) => { throw error; });
    },
    GetCategory: async (categoryId: number) => {
        return AxiosInstance.get(`/GetCategory/${categoryId}`).then((response) => response).catch((error) => { throw error; });
    },
};

export default CategoryService;