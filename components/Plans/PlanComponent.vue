<template>
    <div class="plan-container">
        <h2 class="plan-title">Event Plan</h2>
        <div v-if="loading">
            <LoadingCyrcle></LoadingCyrcle>
        </div>
        <div v-else>
            <div class="plan-column">
                <div class="plan-content" v-html="renderedMarkdown">
                </div>
                <button class="button" @click="editPageRedirect"
                    :style="{ backgroundColor: themeParams.button_color }">Edit</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useEventPlan } from '@/components/Plans/useEventPlan';
import { useTheme } from 'vue-tg';
import { useRouter } from 'vue-router';

const { themeParams } = useTheme();

const props = defineProps({
    eventId: {
        type: Number,
        required: true,
    },
});

const { renderedMarkdown, loading, fetchMarkdown } = useEventPlan(props.eventId);

onMounted(async () => {
    await fetchMarkdown();
});

const editPageRedirect = () => {
    const router = useRouter();
    router.push(`/event/${props.eventId}/plan`);
};

</script>

<style scoped src="@/styles/PlanStyles.css"></style>
