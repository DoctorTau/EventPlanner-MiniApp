<template>
    <div class="task-create-modal" v-if="isVisible">
        <div class="modal-content">
            <h3>Create Task</h3>
            <label for="task-title">Task Title:</label>
            <input id="task-title" v-model="taskTitle" type="text" placeholder="Enter task title" class="input-field" />
            <div class="actions">
                <button @click="createTask" class="create-button">Create</button>
                <button @click="closeModal" class="cancel-button">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useTheme } from 'vue-tg';
import ServerRequest from '@/utils/server_request';

const taskTitle = ref('');
const isVisible = ref(true);

const themeParams = useTheme().themeParams;

const props = defineProps({
    eventId: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['taskCreated', 'close']);

const createTask = async () => {
    if (!taskTitle.value.trim()) {
        alert('Task title cannot be empty.');
        return;
    }

    try {
        const serverRequest = await ServerRequest.getInstance();
        const newTask = await serverRequest.post('/api/Task/create', {
            Title: taskTitle.value,
            EventId: props.eventId,
        });

        emit('taskCreated', newTask);
        closeModal();
    } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
    }
};

const closeModal = () => {
    isVisible.value = false;
    emit('close');
};
</script>

<style scoped>
.task-create-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
}

.input-field {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.create-button {
    background: v-bind('themeParams.button_color');
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-button {
    background: #ccc;
    color: black;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}
</style>