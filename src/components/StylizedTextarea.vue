<script setup>
import { useTextareaAutosize } from '@vueuse/core';

const emit = defineEmits(['submitForm', 'taskTextarea:task']);
const task = defineModel();
const { textarea } = useTextareaAutosize();

const getLabel = (label) => {
    switch (label) {
        case "add-task":
            return "Agregar nueva tarea:";
        case "edit-task":
            return "Editar tarea:";
        case "motive-details":
            return "Detalles de la consulta:";
        default:
            break;
    }
}

const getPlaceholder = (type) => {
    switch (type) {
        case "add-task":
            return "Escriba su tarea acá:";
        case "edit-task":
            return "Edite su tarea acá";
        case "motive-details":
            return "Contanos más sobre el motivo de tu consulta";
        default:
            break;
    }
}

defineProps({
    textType: String,
    font: String
});

</script>

<template>
    <div :class="{'task-create' : textType !== 'motive-details', 'help-textarea' : textType === 'motive-details'}">
        <label :for="textType" :class="{'sr-only' : textType !== 'motive-details'}">
            {{ getLabel(textType) }}
        </label>

        <textarea
            :name="textType"
            :id="textType"
            :placeholder="getPlaceholder(textType)"
            :maxlength="textType !== 'motive-details' ? '75' : '200'"
            class="textarea-style"
            :class="[font, { 'title-length-bradius' : task.length === 75 && textType !== 'motive-details', 'title-length-bradius' : task.length === 200 && textType === 'motive-details' }]"
            ref="textarea"
            v-model="task"
            @keydown.enter.prevent="emit('submitForm')"
        />

        <div v-if="textType !== 'motive-details'" class="title-length" :class="{'title-length-bg' : task.length === 75}">
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

        <div v-else-if="textType === 'motive-details'" class="title-length" :class="{'title-length-bg' : task.length === 200}">
            <Transition name="fade">
                <p v-if="task.length === 200">Alcanzaste el límite de carácteres</p>
            </Transition>

            <div>
                <span :class="{'title-length-color' : task.length === 200 }">
                    {{ task.length }}
                </span>

                <span class="title-length-color">/200</span>
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

    .help-textarea {
        display: flex;
        flex-direction: column;
        gap: 0 !important;
    }
    .help-textarea label {
        font-size: 1.2rem;
        font-weight: 600;
    }
    .help-textarea textarea {
        min-height: 2.5rem;
        font-size: 1.2rem;
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
        transition: all 0.2s ease-in-out;
    }
    .textarea-style:focus {
        transition: all 0.2s ease-in-out;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    }
    .textarea-style::placeholder {
        color: rgba(0, 0, 0, 0.350);
    }

    .title-length {
        display: flex;
        flex-direction: row !important;
        align-items: center;
        gap: .5rem;
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
        border-radius: 0 0 .7rem .7rem;
    }

    .title-length-bradius {
        border-radius: .7rem .7rem 0 0;
    }
</style>