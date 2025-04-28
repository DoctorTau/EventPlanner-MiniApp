<template>
    <BackButton @click="returnToPrevPage"></BackButton>

    <div v-if="eventItem" class="event-container">
        <div class="header">
            <h1 class="title">
                <template v-if="isEditing">
                    <input v-model="editableTitle" class="edit-input" />
                </template>
                <template v-else>
                    {{ eventItem.title }}
                </template>
            </h1>
            <button @click="toggleEdit" class="edit-button">
                {{ isEditing ? 'Save' : 'Edit' }}
            </button>
        </div>

        <p class="description">
            <template v-if="isEditing">
                <textarea v-model="editableDescription" class="edit-textarea"></textarea>
            </template>
            <template v-else>
                {{ eventItem.description || "" }}
            </template>
        </p>

        <p class="event-type">
            <template v-if="isEditing">
                <select v-model="editableEventType" class="edit-select">
                    <option v-for="(type, index) in groupEventTypes" :key="index" :value="index">
                        {{ type }}
                    </option>
                </select>
            </template>
            <template v-else>
                {{ groupEventTypes[eventItem.eventType] || "" }}
            </template>
        </p>

        <div class="date-container">
            <p class="date"><strong>Date:</strong> {{ formattedDate }}</p>
            <button @click="startDatePoll" v-if="formattedDate === 'No date available'" class="start-date-poll-button">
                Start date poll
            </button>
        </div>
        <div class="date-container">
            <p class="location"><strong>Location:</strong> {{ eventItem.location || "No location provided" }}</p>
            <button @click="openLocationPage" v-if="eventItem.location === null" class="start-date-poll-button">
                Open location page
            </button>
        </div>

        <h2>Participants</h2>
        <ul v-if="eventItem.participants.length">
            <li v-for="participant in eventItem.participants" :key="participant.telegramId">
                {{ participant.firstName }} {{ participant.lastName }} (@{{ participant.username }})
            </li>
        </ul>
        <p v-else>No participants yet.</p>

        <h2>Tasks</h2>
        <div class="tasks" v-if="eventTasks.length">
            <TaskTile v-for="task in eventTasks" :key="task.id" :taskModel="task"></TaskTile>

        </div>
        <button @click="openTaskCreateModal" class="big-button">+ Create Task</button>

        <TaskCreate v-if="isTaskCreateModalVisible" :eventId="eventItem.id" @taskCreated="addTask"
            @close="closeTaskCreateModal" />

        <PlanComponent v-if="eventItem" :eventId="eventItem.id" />

        <div style="display: flex; justify-content: center;">
            <button class="MessageButton" @click="sendMessage">
                <Icon :name="mailIcon" size="32" />
            </button>
        </div>


    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ServerRequest from '@/utils/server_request'
import type { EventItem } from '@/components/Event/EventItem';
import type { TaskModel } from '@/components/Task/TaskItem';
import PlanComponent from '@/components/Plans/PlanComponent.vue';

const { BackButton, useWebAppTheme, useBackButton } = await import('vue-tg');
const backButton = useBackButton();
const { themeParams } = useWebAppTheme();

const route = useRoute();
const router = useRouter();
const eventItem = ref<EventItem>();
const groupEventTypes = ref<string[]>([]);
const eventTasks = ref<TaskModel[]>([]);

const isEditing = ref(false);
const editableTitle = ref('');
const editableDescription = ref('');
const editableEventType = ref(0);

const isActive = ref(true);

const mailIcon = ref('material-symbols:mail');

const returnToPrevPage = () => {
    window.history.back();
};

const fetchEvent = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const eventResponse = await serverRequest.get<EventItem>(`/api/Event/${route.params.id}`);
        eventItem.value = eventResponse;
        editableTitle.value = eventResponse.title;
        editableDescription.value = eventResponse.description || '';
        editableEventType.value = eventResponse.eventType;
    } catch (error) {
        console.error("Error fetching event details:", error);
    }
};

const fetchGroupEventTypes = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const response = await serverRequest.get<{ value: string; displayName: string }[]>(`/api/Event/getEventTypes`);
        // Convert response to string array with display name
        groupEventTypes.value = response.map(item => item.displayName);
    } catch (error) {
        console.error("Error fetching group event types:", error);
    }
};

const fetchTasks = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const tasksResponse = await serverRequest.get<TaskModel[]>(`/api/Task/event/${route.params.id}`);
        console.log("Tasks response:", tasksResponse);
        if (eventTasks.value) {
            eventTasks.value = tasksResponse;
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};

const formattedDate = computed(() => {
    if (!eventItem.value?.eventDate) return "No date available";

    const date = new Date(eventItem.value.eventDate);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
});

const startDatePoll = async () => {
    const serverRequest = await ServerRequest.getInstance();
    await serverRequest.post(`/api/Poll/${route.params.id}/start-date-poll`, {});
}

const openLocationPage = () => {
    router.push(`/event/${route.params.id}/locations`);
}

const toggleEdit = async () => {
    if (isEditing.value) {
        // Save mode: Send update request
        const serverRequest = await ServerRequest.getInstance();
        try {
            await serverRequest.put(`/api/Event/${route.params.id}/updateEventDetails`, {
                title: editableTitle.value,
                description: editableDescription.value.length == 0 ? null : editableDescription.value,
                eventType: editableEventType.value
            });
            // Update local event data after successful save
            if (eventItem.value) {
                eventItem.value.title = editableTitle.value;
                eventItem.value.description = editableDescription.value;
                eventItem.value.eventType = editableEventType.value;
            }
        } catch (error) {
            console.error("Error updating event details:", error);
        }
    }
    isEditing.value = !isEditing.value;
}

const isTaskCreateModalVisible = ref(false);

const openTaskCreateModal = () => {
    isTaskCreateModalVisible.value = true;
};

const closeTaskCreateModal = () => {
    isTaskCreateModalVisible.value = false;
};

const addTask = (newTask: TaskModel) => {
    eventTasks.value.push(newTask);
};

const sendMessage = async () => {
    const serverRequest = await ServerRequest.getInstance();
    await serverRequest.post(`/api/Event/${route.params.id}/sendMessage`, {});
};

onMounted(async () => {
    isActive.value = true;
    await fetchEvent();
    await fetchGroupEventTypes();
    await fetchTasks();

    if (backButton.show) {
        backButton.show();
    }
});

onUnmounted(() => {
    isActive.value = false;
    setTimeout(() => {
        if (backButton.hide) {
            backButton.hide();
        }
    }, 0);
});
</script>

<style scoped>
.event-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border: 2px solid black;
    border-radius: 12px;
    background: white;
    font-family: 'Montserrat', sans-serif;
}

.title {
    font-size: 1.5em;
    font-weight: bold;
}

.description,
.date,
.location {
    font-size: 1em;
    margin-top: 8px;
}

ul {
    padding: 0;
    list-style: none;
}

li {
    font-size: 0.9em;
    margin-top: 4px;
}

.start-date-poll-button {
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1em;
    background: v-bind('themeParams.button_color');
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.date-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.locations-container {
    max-width: 600px;
    margin: 20px auto 0;
    padding: 20px;
    border: 2px solid black;
    border-radius: 12px;
    background: white;
    font-family: 'Montserrat', sans-serif;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.edit-button {
    padding: 8px 16px;
    background: v-bind('themeParams.button_color');
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9em;
    cursor: pointer;
}

.tasks {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.edit-input,
.edit-textarea,
.edit-select {
    width: 100%;
    font-size: 1em;
    padding: 8px;
    margin-top: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: transparent;
}

.big-button {
    width: 100%;
    display: inline-block;
    padding: 10px 20px;
    font-size: 1em;
    color: #fff;
    background-color: v-bind('themeParams.button_color');
    border: none;
    border-radius: 5px;
    cursor: pointer;
    justify-content: center;
    justify-self: center;
}

.MessageButton {
    background-color: v-bind('themeParams.button_color');
    color: white;
    border: none;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 10px;
    width: 50%;
}
</style>