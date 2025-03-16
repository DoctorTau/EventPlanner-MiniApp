<template>
  <div class="calendar-container">
    <h2>
      <button @click="prevMonth">◀</button>
      {{ currentMonthYear }}
      <button @click="nextMonth">▶</button>
    </h2>
    <div class="calendar">
      <div class="day-label" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
      <div v-for="n in firstDayOffset" :key="'empty-' + n" class="day empty"></div>
      <div v-for="day in days" :key="day.date.toISOString()" class="day" :class="{
        'current-day': isCurrentDay(day.date),
        'selected-day': isSelected(day.date),
        'new-selected-day': isNewSelected(day.date)
      }" @click="toggleDaySelection(day.date)">
        {{ day.dayNumber }}
      </div>
    </div>
    <MainButton @click="updateSelectedDays" text="Save" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ServerRequest from '@/utils/server_request';
const { useWebAppTheme, useWebAppPopup, useWebAppHapticFeedback, useWebAppMainButton, MainButton } = await import('vue-tg');

const { themeParams } = useWebAppTheme();
const { showAlert } = useWebAppPopup();
const mainButton = useWebAppMainButton();
const hapticFeedback = useWebAppHapticFeedback();

const selectedDays = ref<Date[]>([]); // Saved days from server
const newSelectedDays = ref<Date[]>([]); // Newly selected days by user
const deletedDays = ref<Date[]>([]); // Days that were deselected from saved data
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const loading = ref(false);

onMounted(getAvailability);

const firstDayOffset = computed(() => {
  let offset = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return offset === 0 ? 6 : offset - 1; // Adjust to start week on Monday
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

const isCurrentDay = (date: Date) => date.toDateString() === today.toDateString();
const isSelected = (date: Date) => selectedDays.value.some(d => d.toDateString() === date.toDateString());
const isNewSelected = (date: Date) => newSelectedDays.value.some(d => d.toDateString() === date.toDateString());

const toggleDaySelection = (date: Date) => {
  hapticFeedback.impactOccurred('light');

  const savedIndex = selectedDays.value.findIndex(d => d.toDateString() === date.toDateString());
  if (savedIndex !== -1) {
    selectedDays.value.splice(savedIndex, 1);
    deletedDays.value.push(date);
    return;
  }

  const deletedIndex = deletedDays.value.findIndex(d => d.toDateString() === date.toDateString());
  if (deletedIndex !== -1) {
    selectedDays.value.push(date);
    deletedDays.value.splice(deletedIndex, 1);
    return;
  }

  const newIndex = newSelectedDays.value.findIndex(d => d.toDateString() === date.toDateString());
  if (newIndex !== -1) {
    newSelectedDays.value.splice(newIndex, 1);
    deletedDays.value = deletedDays.value.filter(d => d.toDateString() !== date.toDateString());
  } else {
    newSelectedDays.value.push(date);
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

async function getAvailability() {
  try {
    const serverRequest = await ServerRequest.getInstance();
    const response = await serverRequest.get<{ $values: any[] }>('/api/user/availability');
    selectedDays.value = response.$values.map(item => adjustDateForTimezone(new Date(item.availableDate)));
    newSelectedDays.value = [];
    deletedDays.value = [];
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
}


async function updateSelectedDays() {
  try {
    mainButton.showMainButtonProgress();
    await saveSelectedDays();
    await deleteSelectedDays();
    await getAvailability(); // Refresh saved data after update
    showAlert('Availability updated successfully');
    hapticFeedback.impactOccurred('medium');
  } catch (error) {
    console.error('Error updating availability:', error);
  }
  mainButton.hideMainButtonProgress();
}

async function saveSelectedDays() {
  try {
    const serverRequest = await ServerRequest.getInstance();
    await serverRequest.post('/api/user/availability', newSelectedDays.value.map(date => adjustDateForTimezone(date).toISOString()));
  } catch (error) {
    console.error('Error saving availability:', error);
  }
}

async function deleteSelectedDays() {
  try {
    const serverRequest = await ServerRequest.getInstance();
    await serverRequest.delete('/api/user/availability', deletedDays.value.map(date => adjustDateForTimezone(date).toISOString()));
  } catch (error) {
    console.error('Error deleting availability:', error);
  }
}

function adjustDateForTimezone(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}
</script>

<style scoped>
.new-selected-day {
  background: rgba(76, 175, 80, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}
</style>

<style scoped>
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

.new-selected-day {
  background: rgba(33, 150, 243, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

.current-day {
  background: rgba(252, 175, 88, 1) !important;
  font-weight: bold;
}
</style>
