<template>
    <BackButton @click="returnToPrevPage"></BackButton>

    <div v-if="eventItem" class="event-container">
        <h1 class="title">{{ eventItem.title }}</h1>
        <p class="description">{{ eventItem.description || "" }}</p>
        <div class="date-container">
            <p class="date"><strong>Date:</strong> {{ formattedDate }}</p>
            <button @click="startDatePoll" v-if="formattedDate === 'No date available'" class="start-date-poll-button">
                Start date poll
            </button>
        </div>
        <div class="date-container">
            <p class="location"><strong>Location:</strong> {{ eventItem.location || "No location provided" }}</p>
            <button @click="openLocationPage" v-if="eventItem.location === null" class="start-date-poll-button">
                Open location page
            </button>
        </div>

        <h2>Participants</h2>
        <ul v-if="eventItem.participants.length">
            <li v-for="participant in eventItem.participants" :key="participant.telegramId">
                {{ participant.firstName }} {{ participant.lastName }} (@{{ participant.username }})
            </li>
        </ul>
        <p v-else>No participants yet.</p>
    </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ServerRequest from '@/utils/server_request'
import type { EventItem } from '@/components/Event/EventItem';
const { BackButton, useWebAppTheme, useBackButton } = await import('vue-tg');
const backButton = useBackButton();
const { themeParams } = useWebAppTheme();

const route = useRoute();
const router = useRouter();
const eventItem = ref<EventItem>();

const returnToPrevPage = () => {
    window.history.back();
};

const fetchEvent = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const eventResponse = await serverRequest.get<EventItem>(`/api/Event/${route.params.id}`);
        eventItem.value = eventResponse;
        console.log(eventItem.value.participants);
    } catch (error) {
        console.error("Error fetching event details:", error);
    }
};

const formattedDate = computed(() => {
    if (!eventItem.value?.eventDate) return "No date available";

    const date = new Date(eventItem.value.eventDate);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
});

const startDatePoll = async () => {
    const serverRequest = await ServerRequest.getInstance();

    await serverRequest.post(`/api/Poll/${route.params.id}/start-date-poll`, {});
}

const openLocationPage = () => {
    console.log("Open location page");
    router.push(`/event/${route.params.id}/locations`);
}

onMounted(
    async () => {
        await fetchEvent();

        if (backButton.show) {
            backButton.show();
        }
    }
);
</script>

<style scoped>
.event-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 2px solid black;
    border-radius: 12px;
    background: white;
    font-family: 'Montserrat', sans-serif;
}

.title {
    font-size: 1.5em;
    font-weight: bold;
}

.description,
.date,
.location {
    font-size: 1em;
    margin-top: 8px;
}

ul {
    padding: 0;
    list-style: none;
}

li {
    font-size: 0.9em;
    margin-top: 4px;
}

.start-date-poll-button {
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1em;
    background: v-bind('themeParams.button_color');
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.date-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.locations-container {
    max-width: 600px;
    margin: 20px auto 0;
    padding: 20px;
    border: 2px solid black;
    border-radius: 12px;
    background: white;
    font-family: 'Montserrat', sans-serif;
}
</style>