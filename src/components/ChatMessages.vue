<template>
    <div v-for="message in $props.messages" v-bind:key="message.id" class="message_wrapper">
        <div>
            <strong>{{ message.role }}: </strong>{{ message.content }}
        </div>
    </div>
</template>

<script lang="ts">
import { IMesssage } from '@/types/message';
import { PropType, defineComponent } from 'vue';

export default defineComponent({
    name: 'ChatMessages',
    props: {
        messages: Object as PropType<Array<IMesssage>>,
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.message_wrapper {
    display: flex;
    width: 100%;
}

</style>
