<script setup>
import { watch } from 'vue';
import { useTextareaAutosize } from '@vueuse/core';

const emit = defineEmits(['submitForm', 'taskTextarea:task']);

const task = defineModel();

defineProps({
    textType: String,
    taskTitle: String,
    font: String
});

const { textarea: title, input: titleInput } = useTextareaAutosize();
watch(() => task, (newValue) => { titleInput.value = newValue });
watch(() => titleInput.value, (newValue) => { task = newValue });
</script>

<template>
    <div :class="textType === 'add-task' ? 'task-create' : 'edit-task-div'">
        <label :for="textType" class="sr-only">
            {{ textType === 'add-task' ? 'Agregar nueva tarea:' : 'Editar tarea' }}
        </label>

        <textarea
            :name="textType"
            :id="textType"
            :placeholder="textType === 'add-task' ? 'Escriba su tarea acá:' : 'Edite su tarea acá'"
            maxlength="75"
            class="textarea-style"
            :class="[font, { 'title-length-bradius' : task.length === 75 }]"
            ref="title"
            v-model="task"
            @keydown.enter.prevent="emit('submitForm')"
        />

        <div class="title-length" :class="{ 'title-length-bg' : task.length === 75 }">
            <Transition name="fade">
                <p v-if="task.length === 75">Alcanzaste el límite de carácteres</p>
            </Transition>

            <div>
                <span :class="{'title-length-color' : task.length === 75 }">
                    {{ task.length }}
                </span>

                <span class="title-length-color">/75</span>
            </div>
        </div>
    </div>
</template>

<style>
    .task-create {
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 0 !important;
        width: 100%;
    }

    .textarea-style {
        height: auto;
        min-height: auto;
        width: 100%;
        padding: .3rem;
        background-color: transparent;
        color: rgba(0, 0, 0, 0.780);
        font-size: 1.5rem;
        border: 1.5px solid rgba(0, 0, 0, 0.275);
        border-radius: .7rem;
        outline: none;
        resize: none;
        overflow: hidden;
    }
    .textarea-style::placeholder {
        color: rgba(0, 0, 0, 0.350);
    }

    .title-length {
        display: flex;
        flex-direction: row !important;
        align-items: center;
        justify-content: space-between;
        padding: .5rem;
    }
    .title-length p {
        min-width: max-content;
        text-decoration: underline;
    }
    .title-length div {
        display: flex;
        flex-direction: row !important;
        justify-content: end;
        gap: 0 !important;
        width: 100%;
    }

    .title-length-color {
        color: rgba(0, 0, 0, 0.8);
        font-weight: 600;
    }

    .title-length-bg {
        background-color: #bda17480;
        border: 1.5px solid rgba(0, 0, 0, 0.275);
        border-top: 0;
        border-radius: 0 0 .7rem .7rem;
    }

    .title-length-bradius {
        border-radius: .7rem .7rem 0 0;
    }
</style>