<template>
  <BackButtonTg />

  <div v-if="eventItem" class="event-container">
    <h1 class="title">Location Poll for: {{ eventItem.title }}</h1>

    <div v-if="pollItem?.status == PollStatus.Pending">
      <input v-model="newLocation" placeholder="Suggest a location" class="location-input" />
      <button @click="addLocation" class="start-date-poll-button">Add Location</button>
    </div>

  </div>

  <div class="event-container">
    <h2 class="description">Suggested Locations</h2>
    <ul v-if="pollItem?.options.length">
      <li v-for="location in pollItem?.options" :key="location">
        <LocationTile :locationName="location" />
      </li>
    </ul>
    <p v-else>No locations suggested yet.</p>
  </div>

  <MainButton v-if="pollItem?.status == PollStatus.Pending && pollItem?.options.length > 1" @click="startLocationPoll"
    text="Start poll" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ServerRequest from '@/utils/server_request';
import LocationTile from '@/components/Locations/LocationTile.vue';
import type { EventItem } from '@/components/Event/EventItem';
import { PollStatus, type PollModel } from '~/components/PollModel';
const { MainButton, useWebAppTheme } = await import('vue-tg');
import BackButtonTg from '@/components/BackButtonTg.vue';

const { themeParams } = useWebAppTheme();
const route = useRoute();

const eventItem = ref<EventItem>();
const pollItem = ref<PollModel>();
const newLocation = ref('');

const fetchEvent = async () => {
  try {
    const serverRequest = await ServerRequest.getInstance();
    eventItem.value = await serverRequest.get<EventItem>(`/api/Event/${route.params.id}`);
    await fetchLocations();
  } catch (error) {
    console.error('Error loading event or locations:', error);
  }
};

const fetchLocations = async () => {
  try {
    const serverRequest = await ServerRequest.getInstance();
    pollItem.value = await serverRequest.get<PollModel>(`/api/Poll/${route.params.id}/get-location-poll`);
  } catch (error) {
    console.error('Error loading locations:', error);
  }
};

const addLocation = async () => {
  if (!newLocation.value) return;

  try {
    const serverRequest = await ServerRequest.getInstance();
    await serverRequest.put(`/api/Poll/${route.params.id}/add-location/?location=${newLocation.value}`, {});
    pollItem.value?.options.push(newLocation.value);
    newLocation.value = '';
    await fetchLocations(); // Refresh the list of locations
  } catch (error) {
    console.error('Failed to add location:', error);
  }
};

const startLocationPoll = async () => {
  try {
    const serverRequest = await ServerRequest.getInstance();
    eventItem.value = await serverRequest.put<EventItem>(`/api/Poll/${pollItem.value?.pollId}/start-poll`, {});
  } catch (error) {
    console.error('Failed to start location poll:', error);
  }
};

onMounted(async () => {
  await fetchEvent();
});
</script>

<style scoped>
.event-container {
  max-width: 600px;
  margin: 10px auto;
  padding: 20px;
  border: 2px solid black;
  border-radius: 12px;
  background: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.5em;
  font-weight: bold;
}

.description {
  font-size: 1em;
  margin-top: 8px;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
}

ul {
  padding: 0;
  list-style: none;
}

li {
  font-size: 0.9em;
  margin-top: 4px;
}

.location-input {
  margin: 12px auto;
  /* Выровнять по центру */
  display: block;
  padding: 10px;
  width: 90%;
  /* Или другой % по желанию */
  font-size: 1em;
  border: 1px solid #111;
  border-radius: 8px;
}

.start-date-poll-button {
  margin-top: 12px;
  padding: 10px 20px;
  font-size: 1em;
  background: v-bind('themeParams.button_color');
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>