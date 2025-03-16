<template>
  <div>
    <BackButton @click="returnToPrevPage" />
    <h1>Calendar Page</h1>
    <CalendarComponent />
  </div>
</template>

<script setup>

const { BackButton, useWebAppTheme } = await import('vue-tg');
const { themeParams } = useWebAppTheme();

const returnToPrevPage = () => {
  window.history.back();
};

</script>

<style scoped>
h1 {
  color: vue-bind('themeParams.text_color');
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  margin-top: 20px;
}
</style>