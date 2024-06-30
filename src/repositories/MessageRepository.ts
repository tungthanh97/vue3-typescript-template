import { VUE_APP_BACKEND_API_URL } from '@/constants/config';
import createRepository from '@/repositories/createRepository';
import { IMesssage } from '@/types/message';

const MessageRepository = createRepository({
    getMessages: async (fetch) => {
        const response = await fetch<IMesssage[]>(`${VUE_APP_BACKEND_API_URL}/message`, {
            method: 'GET',
        });
        return response;
    },
    postMessage: async (_, message: string) => {
        const response = await fetch(`${VUE_APP_BACKEND_API_URL}/message`, {
            method: 'POST',
            body: message,
            headers: {
                'Content-Type': 'text/event-stream',
            },
        });
        return response;
    },
});

export default MessageRepository;
