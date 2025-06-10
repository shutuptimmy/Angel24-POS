import AxiosInstance from "../AxiosInstance";
import type { Order } from '../components/interfaces/order/Order'; 
import type { StoreOrderResponse } from "../components/interfaces/order/StoreOrderResponse";
import type { StoreOrderPayload } from "../components/interfaces/order/StoreOrderPayload";

const OrderService = {
    
    LoadOrders: async (): Promise<Order[]> => {
        return AxiosInstance.get<{ orders: Order[] }>('/LoadOrders').then((response) => response.data.orders) .catch((error) => { throw error; });
    },

    GetOrder: async (orderId: number): Promise<Order> => {
        return AxiosInstance.get<{ order: Order }>(`/GetOrder/${orderId}`).then((response) => response.data.order).catch((error) => { throw error; });
    },

    StoreOrder: async (data: StoreOrderPayload): Promise<StoreOrderResponse> => {
        return AxiosInstance.post<StoreOrderResponse>('/StoreOrder', data).then((response) => response.data).catch((error) => { throw error; });
    },
};

export default OrderService;