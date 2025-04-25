<template>
    <BackButtonTg />

    <EditablePlanComponent :eventId="Number(route.params.id)" />
</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';
import EditablePlanComponent from '@/components/Plans/EditablePlanComponent.vue';
import BackButtonTg from '@/components/BackButtonTg.vue'

const route = useRoute();

const GeneratePlan = async () => {
    const inputField = document.querySelector('.input-field input') as HTMLInputElement;
    const inputValue = inputField.value;

    if (inputValue) {
        // Call the function to generate the plan with the input value
        await EditablePlanComponent.generatePlan(inputValue);
        inputField.value = ''; // Clear the input field after generating the plan
    }
};

</script>
