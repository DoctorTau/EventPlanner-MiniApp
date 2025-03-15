<script setup lang="ts">
import CalendarComponent from '@/components/CalendarComponent.vue';


const { MainButton, useWebAppPopup, useWebApp } = await import('vue-tg');

const { showAlert } = useWebAppPopup();
const { initData, initDataUnsafe } = useWebApp();

const handleButtonClick = async () => {
    try {
        console.log(`TMiniApp ${initData}`)

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `TMiniApp ${initData}`);
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch('https://localhost:7237/api/User/auth', {
            method: 'POST',
            headers: myHeaders,
            // mode: "no-cors"
        });
        const userData = await response.json();
        showAlert(userData.username);
        console.log(response.status);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};


</script>

<template>
  <div>
    <h1>Welcome to EventPlanner MiniApp</h1>
    <p>This is the first page of your Nuxt.js application.</p>
    <p>Hello {{ initDataUnsafe.user?.username }}</p>

    <CalendarComponent />

    <MainButton text="Click me!" @click="handleButtonClick"></MainButton>
  </div>
</template>

<style scoped>
h1 {
  color: #2c3e50;
}
</style>