<template>
    <div class="container">
        <ChatMessages :messages="messages" />
        <form @submit.prevent="submitMessage" class="message-input">
            <input type="message" v-model="messageInput" />

            <button type="submit">Send</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ChatMessages from '@/components/ChatMessages.vue';
import { ESTREAM_TYPE, IMesssage, MESSAGE_ROLE } from '@/types/message';
import MessageRepository from '@/repositories/MessageRepository';
import { VUE_APP_BACKEND_API_URL } from '@/constants/config';
import {SSE} from 'sse.js'

export default defineComponent({
    name: 'App',
    components: {
        ChatMessages,
    },
    setup() {
        const messages = ref<IMesssage[]>([]);
        const messageInput = ref<string>('');

        MessageRepository.getMessages().then((response) => {
            console.log(response);
            if (!response.error) messages.value = response.data;
        });

        const submitMessage = async () => {
            messages.value.push({
                id: String(messages.value.length + 1),
                role: MESSAGE_ROLE.HUMAN,
                content: messageInput.value,
            });

            const aiResponse = new SSE(`${VUE_APP_BACKEND_API_URL}/message`, {
                method: 'POST',
                payload: messageInput.value,
                headers: {
                    'Content-Type': 'text/event-stream',
                }
            });

            messages.value.push({
                    id: String(messages.value.length + 1),
                    role: MESSAGE_ROLE.AI,
                    content: '',
                });

            const lastestMessage = messages.value[messages.value.length - 1];
            aiResponse.addEventListener(ESTREAM_TYPE.NEW_TOKEN,(e:any) => {
                const data = JSON.parse(e.data);
                lastestMessage.content += data.content;
            });
            messageInput.value = '';
        };

        return {
            messages,
            messageInput,
            submitMessage,
        };
    },
});
</script>

<style>
.container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message-input input {
    width: 500px;
    padding: 10px;
    font-size: 16px;
}

.message-input button {
    height: 40px;
    padding: 10px;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
