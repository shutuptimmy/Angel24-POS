import AxiosInstance from "../AxiosInstance";
import type { AxiosResponse } from 'axios';
import type { Feedbacks } from '../components/interfaces/feedback/Feedbacks'; // New import for data received
import type { FeedbackPayload } from '../components/interfaces/feedback/FeedbackPayload'; // New import for data sent

const FeedbackService = {

    LoadFeedbacks: async (): Promise<AxiosResponse<{ feedbacks: Feedbacks[] }>> => { 
        return AxiosInstance.get<{ feedbacks: Feedbacks[] }>('/LoadFeedbacks')
            .then((response) => response)
            .catch((error) => { throw error; });
    },
    
    StoreFeedback: async (data: FeedbackPayload): Promise<AxiosResponse<any>> => { 
        return AxiosInstance.post("/StoreFeedback", data).then((response) => response).catch((error) => { throw error; });
    },
};

export default FeedbackService;