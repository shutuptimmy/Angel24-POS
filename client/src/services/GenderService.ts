import AxiosInstance from "../AxiosInstance";

const GenderService = {
    loadGenders: async () => {
        return AxiosInstance.get('/loadGenders').then((response) => response).catch((error) => { throw error; });
    },
    getGender: async (genderId: number) => {
        return AxiosInstance.get(`/getGender/${genderId}`).then((response) => response).catch((error) => { throw error; });
    },
};

export default GenderService;