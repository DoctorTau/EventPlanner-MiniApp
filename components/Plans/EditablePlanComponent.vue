<template>
    <div class="plan-container">
        <h2 class="plan-title">Event Plan</h2>
        <div v-if="loading">
            <LoadingCyrcle></LoadingCyrcle>
        </div>
        <div v-else>
            <div class="plan-content" contenteditable="true" v-html="renderedMarkdown" @input="handleInput"></div>
            <div class="prompt-area">
                <input class="input-field" type="text" v-model="userPrompt"
                    :style="{ borderColor: themeParams.text_color }" placeholder="Write your prompt" />
                <button class="button" :style="{ backgroundColor: themeParams.button_color }" @click="GeneratePlan">
                    <div v-if="markdownText.length == 0">
                        Generate plan
                    </div>
                    <div v-else>
                        Regenerate plan
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEventPlan } from '@/components/Plans/useEventPlan';
import { useTheme } from 'vue-tg';
import ServerRequest from '@/utils/server_request';

const props = defineProps({
    eventId: {
        type: Number,
        required: true,
    },
});

const { markdownText, renderedMarkdown, loading, fetchMarkdown } = useEventPlan(props.eventId);
const { themeParams } = useTheme();

// Reactive variable to store the user prompt
const userPrompt = ref('');

const handleInput = (event) => {
    markdownText.value = event.target.innerHTML;
};

const saveChanges = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const plainText = markdownText.value.replace(/<[^>]*>/g, ''); // Strip HTML tags
        await serverRequest.post(`/api/Event/${props.eventId}/updateEventPlan`, { content: plainText });
        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Error saving event plan:', error);
        alert('Failed to save changes.');
    }
};

onMounted(async () => {
    await fetchMarkdown();
});

const GeneratePlan = async () => {
    const planText = markdownText.value.replace(/<[^>]*>/g, ''); // Strip HTML tags

    loading.value = true; // Show loading spinner

    if (userPrompt.value) {
        const serverRequest = await ServerRequest.getInstance();
        if (planText.length > 0) {
            await serverRequest.put(`/api/Event/${props.eventId}/updatePlan`, {
                original_plan: planText,
                user_comment: userPrompt.value,
            });
        } else {
            await serverRequest.post(`/api/Event/${props.eventId}/generatePlan`, userPrompt.value);
        }

        await fetchMarkdown();
        userPrompt.value = ''; // Clear the input field after generating the plan
        loading.value = false; // Hide loading spinner
    }
};
</script>

<style scoped src="@/styles/PlanStyles.css"></style>