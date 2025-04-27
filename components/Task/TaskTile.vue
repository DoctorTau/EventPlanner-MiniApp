<template>
    <div class="task-tile">
        <button @click="toggleEdit" class="edit-icon-button">
            <Icon :name="isEditing ? saveIcon : editIcon" size="24" />
        </button>
        <h3 class="title">{{ taskModel.title }}</h3>

        <div v-if="isEditing" class="edit-section">
            <label for="assignee-select">Assignee:</label>
            <select id="assignee-select" v-model="editableAssignee">
                <option value="">Unassigned</option>
                <option v-for="user in participants" :key="user.userId" :value="user.userId">
                    {{ user.userName }}
                </option>
            </select>
        </div>
        <div v-else>
            <p class="assignee"><strong>Assignee:</strong> {{ assignedToUser || "Unassigned" }}</p>
        </div>

        <div v-if="isEditing" class="edit-section">
            <label for="status-select">Status:</label>
            <select id="status-select" v-model="editableStatus" class="selector">
                <option v-for="(status, index) in taskStatuses" :key="index" :value="index">
                    {{ status }}
                </option>
            </select>
        </div>
        <div v-else>
            <p class="status"><strong>Status:</strong> {{ taskStatuses[taskModel.status] }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { TaskModel } from '@/components/Task/TaskItem';
import ServerRequest from '@/utils/server_request';
import type { EventItem } from '../Event/EventItem';

const props = defineProps({
    taskModel: {
        type: Object as () => TaskModel,
        required: true
    }
});

const router = useRouter();
const editIcon = ref('material-symbols:edit-outline');
const saveIcon = ref('material-symbols:save-outline');

const isEditing = ref(false);
const editableAssignee = ref<number | undefined>();
const editableStatus = ref(props.taskModel.status);
const participants = ref<{ userId: number; userName: string }[]>([]);
const assignedToUser = ref<String>();

const taskStatuses = ref<string[]>([]);

const fetchParticipants = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const eventResponse = await serverRequest.get<EventItem>(`/api/Event/${props.taskModel.eventId}`);

        participants.value = eventResponse.participants.map(participant => ({
            userId: participant.id,
            userName: participant.username
        }));

    } catch (error) {
        console.error("Error fetching event details:", error);
    }
};

const fetchTaskStatuses = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        const response = await serverRequest.get<{ value: string; displayName: string }[]>(`/api/Task/statuses`);
        taskStatuses.value = response.map(item => item.displayName);
    } catch (error) {
        console.error('Error fetching task statuses:', error);
    }
};

const updateTask = async () => {
    try {
        const serverRequest = await ServerRequest.getInstance();
        console.log('Updating task:', {
            title: props.taskModel.title,
            assignedTo: editableAssignee.value,
            status: editableStatus.value
        });
        await serverRequest.put(`/api/Task/${props.taskModel.id}`, {
            Title: props.taskModel.title,
            AssignedTo: editableAssignee.value,
            Status: editableStatus.value
        });

        // Update the task model with new values
        props.taskModel.assignedTo = editableAssignee.value;
        props.taskModel.status = editableStatus.value;
        assignedToUser.value = participants.value.find(user => user.userId === editableAssignee.value)?.userName;
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const toggleEdit = async () => {
    if (isEditing.value) {
        try {
            console.log('Saving changes:', {
                assignee: editableAssignee.value,
                status: editableStatus.value
            });
            props.taskModel.assignedTo = editableAssignee.value;
            props.taskModel.status = editableStatus.value;

            await updateTask();
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    }
    isEditing.value = !isEditing.value;
};

onMounted(async () => {
    await fetchTaskStatuses();
    await fetchParticipants();

    const assignedUser = participants.value.find(user => user.userId === props.taskModel.assignedTo);
    console.log('Assigned user:', assignedUser);

    if (assignedUser) {
        assignedToUser.value = assignedUser.userName;
        editableAssignee.value = assignedUser.userId;
    } else {
        assignedToUser.value = undefined;
    }

});


</script>

<style scoped>
.task-tile {
    position: relative;
    display: flex;
    flex-direction: column;
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

.assignment,
.status,
.assignee {
    font-size: 0.9em;
    color: #555;
    margin-top: 8px;
}

.edit-section {
    margin-top: 16px;
}

label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.9em;
    color: #333;
}

select {
    width: 100%;
    padding: 8px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 0.9em;
}

.edit-icon-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
}

.edit-icon-button i {
    pointer-events: none;
    /* Prevent clicks on the icon itself */
}
</style>