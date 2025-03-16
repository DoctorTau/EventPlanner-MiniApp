<template>
    <div class="event-tile">
        <h3 class="title">{{ eventItem.title }}</h3>
        <div class="date-location">
            <p class="date">{{ eventItem.eventDate ? formattedDate : 'TBA' }}</p>
            <p class="location">{{ eventItem.location ? eventItem.location : 'TBA' }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    eventItem: {
        type: Object,
        required: true
    }
});
const formattedDate = computed(() => {
    if (!props.eventItem.eventDate) return "No date available";

    const date = new Date(props.eventItem.eventDate);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
});
</script>

<style scoped>
.event-tile {
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

.date,
.location {
    font-size: 0.9em;
    color: #555;
}
</style>