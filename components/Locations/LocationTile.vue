<template>
    <div class="location-tile">
        <h3 class="title">{{ locationName }}</h3>
    </div>
</template>

<script setup>

const props = defineProps({
    locationName: {
        type: String,
        required: true
    }
});

</script>

<style scoped>
.location-tile {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border: 2px solid black;
    border-radius: 12px;
    background: white;
    font-family: 'Montserrat', sans-serif;
    width: 90%;
    margin-top: 10px;
    max-width: 400px;
}

.title {
    font-weight: bold;
    font-size: 1.2em;
}
</style>