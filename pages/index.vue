<script setup lang="ts">
import ServerRequest from '@/utils/server_request'
import { Icon } from '#components'
import { useRouter } from 'vue-router';

const calendarIcon = ref('material-symbols:calendar-month');


const { useWebAppPopup, useWebApp, useWebAppTheme } = await import('vue-tg');

const { themeParams } = useWebAppTheme();
const { initData, initDataUnsafe } = useWebApp();

const serverRequest = await ServerRequest.getInstance();

onMounted(async () => {
  try {
    const response = await serverRequest.post('/api/user/auth', {});
    console.log(response);
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
    <h1>Welcome to EventPlanner MiniApp</h1>
    <p>This is the first page of your Nuxt.js application.</p>
    <p>Hello {{ initDataUnsafe.user?.username }}</p>

    <div style="display: flex; justify-content: center;">
      <button class="CalendarButton" @click="goToCalendarPage">
        <Icon :name="calendarIcon" size="32" />
      </button>
    </div>

  </div>
</template>

<style scoped>
h1 {
  color: #2c3e50;
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