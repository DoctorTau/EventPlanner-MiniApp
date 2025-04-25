import { ref } from 'vue';
import { marked } from 'marked';
import ServerRequest from '@/utils/server_request';

export function useEventPlan(eventId: number) {
    const markdownText = ref('');
    const renderedMarkdown = ref('');
    const loading = ref(true);

    const updatePlanComponent = async (text: string) => {
        markdownText.value = text;
        const parsedMarkdown = await marked.parse(text.replace(/\\n/g, '\n'));
        renderedMarkdown.value = parsedMarkdown;
    }

    const fetchMarkdown = async () => {
        try {
            const serverRequest = await ServerRequest.getInstance();
            const text = await serverRequest.get<string>(`/api/Event/${eventId}/getEventPlan`);
            await updatePlanComponent(text);
        } catch (error) {
            console.error('Error loading event plan:', error);
            markdownText.value = 'Failed to load event plan.';
            renderedMarkdown.value = '<p><em>Failed to load event plan.</em></p>';
        } finally {
            loading.value = false;
        }
    };

    return {
        markdownText,
        renderedMarkdown,
        loading,
        fetchMarkdown,
    };


}