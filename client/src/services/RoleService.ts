import AxiosInstance from "../AxiosInstance";

const RoleService = {
    LoadRoles: async () => {
        return AxiosInstance.get('/LoadRoles').then((response) => response).catch((error) => { throw error; });
    },
    GetRole: async (roleId: number) => {
        return AxiosInstance.get(`/GetRole/${roleId}`).then((response) => response).catch((error) => { throw error; });
    },
};

export default RoleService;