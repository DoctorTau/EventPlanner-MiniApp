<template>
    <div class="spinner-wrapper">
        <div class="spinner"></div>
    </div>
</template>

<script>
const { useWebAppTheme } = await import('vue-tg');

const { themeParams } = useWebAppTheme();

export default {
    name: 'LoadingSpinner',
}
</script>

<style scoped>
.spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
}

.spinner {
    width: 40px;
    height: 40px;
    /* border: 4px solid v-bind('themeParams.text_color'); */
    /* border-top-color: v-bind('themeParams.button_color'); */
    /* You can change the color */
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>