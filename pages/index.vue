<script setup lang="ts">
import ServerRequest from '@/utils/server_request'
import CalendarComponent from '~/components/CalendarComponent.vue';


const { MainButton, useWebAppPopup, useWebApp } = await import('vue-tg');

const { showAlert } = useWebAppPopup();
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


const handleButtonClick = async () => {
    
};

</script>

<template>
  <div>
    <h1>Welcome to EventPlanner MiniApp</h1>
    <p>This is the first page of your Nuxt.js application.</p>
    <p>Hello {{ initDataUnsafe.user?.username }}</p>

    <CalendarComponent />

    <!-- <MainButton text="Click me!" @click="handleButtonClick"></MainButton> -->
  </div>
</template>

<style scoped>
h1 {
  color: #2c3e50;
}
</style>