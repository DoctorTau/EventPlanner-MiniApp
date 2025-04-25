<template>
    <BackButton @click="returnToPrevPage" />
</template>

<script setup lang="ts">
const { BackButton } = await import('vue-tg');
const { useBackButton } = await import('vue-tg');

const backButton = useBackButton();

const returnToPrevPage = () => {
    window.history.back();
};

onMounted(async () => {
    setTimeout(() => {
        if (backButton.show) {
            backButton.show();
        }
    }, 50);
});


</script>