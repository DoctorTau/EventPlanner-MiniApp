<script setup lang="ts">
import ServerRequest from '@/utils/server_request'
import { Icon } from '#components'
import { useRouter } from 'vue-router';
import type { EventItem } from '@/components/Event/EventItem';

const calendarIcon = ref('material-symbols:calendar-month');


const { useWebAppPopup, useWebApp, useWebAppTheme } = await import('vue-tg');

const { themeParams } = useWebAppTheme();
const { initData, initDataUnsafe } = useWebApp();

const serverRequest = await ServerRequest.getInstance();

const eventItems = ref<EventItem[]>([]);

onMounted(async () => {
  try {
    const response = await serverRequest.post('/api/user/auth', {});
    console.log(response);

    eventItems.value = await serverRequest.get<EventItem[]>('api/Event/getUsersEvents');
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
});

const router = useRouter();

const goToCalendarPage = () => {
  router.push('/calendar');
};


</script>

<template>
  <div>
    <h1>EventPlanner MiniApp</h1>
    <p class="hello">Hello {{ initDataUnsafe.user?.username }}</p>

    <div style="display: flex; justify-content: center;">
      <button class="CalendarButton" @click="goToCalendarPage">
        <Icon :name="calendarIcon" size="32" />
      </button>
    </div>

    <EventTile v-for="eventItem in eventItems" :key="eventItem.id" :eventItem="eventItem" />

  </div>
</template>

<style scoped>
h1 {
  color: #000;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
}

.hello {
  color: #000;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
}

.CalendarButton {
  background-color: v-bind('themeParams.button_color');
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 10px;
  width: 50%;
}
</style>