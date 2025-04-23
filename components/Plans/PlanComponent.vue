<template>
    <div class="plan-container">
        <h2 class="plan-title">Event Plan</h2>
        <div v-if="loading">
            <LoadingCyrcle></LoadingCyrcle>
        </div>
        <div v-else class="plan-content" v-html="renderedMarkdown"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';
import ServerRequest from '@/utils/server_request';

const props = defineProps({
    eventId: {
        type: Number,
        required: true
    }
});

const markdownText = ref('');
const renderedMarkdown = ref('');
const loading = ref(true);

const fetchMarkdown = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        var text = await serverRequest.get(`/api/Event/${props.eventId}/getEventPlan`);
        markdownText.value = text;
        renderedMarkdown.value = marked.parse(text.replace(/\\n/g, '\n'));
    } catch (error) {
        console.error('Error loading event plan:', error);
        markdownText.value = 'Failed to load event plan.';
        renderedMarkdown.value = '<p><em>Failed to load event plan.</em></p>';
    } finally {
        loading.value = false;
    }
};

onMounted(
    async () => {
        await fetchMarkdown();
    }
);
</script>

<style scoped>
.plan-container {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-family: 'Montserrat', sans-serif;
    background-color: #f9f9f9;
    max-width: 800px;
    margin: 20px auto;
}

.plan-title {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 16px;
}

.plan-content {
    font-size: 1em;
    line-height: 1.6;
}

.loading-spinner {
    font-size: 1.2em;
    color: #888;
    text-align: center;
    margin: 20px 0;
}
</style>
