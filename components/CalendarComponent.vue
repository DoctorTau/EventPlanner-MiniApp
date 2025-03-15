<template>
  <div class="calendar-container">
    <h2>
      <button @click="prevMonth">◀</button>
      {{ currentMonthYear }}
      <button @click="nextMonth">▶</button>
    </h2>
    <div class="calendar">
      <div class="day-label" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      <div 
        v-for="n in firstDayOffset" 
        :key="'empty-' + n"
        class="day empty"
      ></div>
      <div 
        v-for="day in days" 
        :key="day.date.toISOString()"
        class="day"
        :class="{
          'current-day': isCurrentDay(day.date),
          'selected-day': isSelected(day.date)
        }"
        @click="toggleDaySelection(day.date)"
      >
        {{ day.dayNumber }}
      </div>
    </div>
    <button @click="saveSelectedDays">Save</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

const { useWebAppTheme } = await import('vue-tg');
const { themeParams } = useWebAppTheme();

const selectedDays = ref<Date[]>([]);
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const daysOfWeek = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const firstDayOffset = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay() - 1;
});

const days = computed(() => {
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  return Array.from({ length: lastDay.getDate() }, (_, i) => ({
    date: new Date(currentYear.value, currentMonth.value, i + 1),
    dayNumber: i + 1
  }));
});

const currentMonthYear = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long', year: 'numeric' });
});

const isCurrentDay = (date: Date) => {
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const isSelected = (date: Date) => {
  return selectedDays.value.some(d => d.getTime() === date.getTime());
};

const toggleDaySelection = (date: Date) => {
  const index = selectedDays.value.findIndex(d => d.getTime() === date.getTime());
  if (index !== -1) {
    selectedDays.value.splice(index, 1);
  } else {
    selectedDays.value.push(new Date(date));
  }
};

const prevMonth = () => {
  currentMonth.value = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
  if (currentMonth.value === 11) currentYear.value--;
};

const nextMonth = () => {
  currentMonth.value = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
  if (currentMonth.value === 0) currentYear.value++;
};

watch([currentMonth, currentYear], () => {
  selectedDays.value = [...selectedDays.value];
});

const saveSelectedDays = async () => {
  try {
    await axios.post('/api/save-free-days', {
      freeDays: selectedDays.value.map(date => date.toISOString())
    });
    alert('Saved successfully!');
  } catch (error) {
    console.error('Error saving free days', error);
  }
};
</script>

<style scoped>
html, body {
  background: rgba(255, 255, 255, 1) !important;
}

.calendar-container {
  background: rgba(255, 255, 255, 1) !important;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  font-family: Arial, sans-serif;
}

h2 {
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

button {
  background: v-bind('themeParams.button_color');
  color: rgba(255, 255, 255, 1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
}

button:hover {
  background: rgba(211, 47, 47, 1);
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-top: 10px;
}

.day-label {
  font-weight: bold;
  color: rgba(75, 75, 75, 1);
}

.day {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid rgba(75, 75, 75, 1);
  background: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 0.87);
}

.empty {
  visibility: hidden;
}

.selected-day {
  background: rgba(76, 175, 80, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

.current-day {
  background: rgba(252, 175, 88, 1) !important;
  font-weight: bold;
}
</style>
