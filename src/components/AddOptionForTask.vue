<script setup>
import { X } from 'lucide-vue-next';
import FineBorderButton from './Button/FineBorderButton.vue';

defineEmits(['close-option:close']);
const close = defineModel();

defineProps({
    option: String,
    labelFor: String,
    close: Boolean
});
</script>

<template>
    <div :class="{
            'task-add-schedule'   : option === 'schedule',
            'task-font-container' : option === 'font'
        }"
    >
        <header>
            <label v-if="option === 'schedule'" :for="labelFor">
                Programar para:
            </label>

            <span v-else>Seleccione una fuente:</span>

            <FineBorderButton @click="close = !close">
                <template #sr-only>
                    {{ option === 'schedule' ? 'Cancelar programación' : 'Cerrar selector de fuentes' }}
                </template>

                <X />
            </FineBorderButton>
        </header>

        <div :class="{ 'task-select-font' : option === 'font' }">
            <slot />
        </div>
    </div>
</template>

<style>
    .task-add-schedule {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 0 !important;
        padding: .5rem;
        background-color: #bda17480;
        border-radius: .7rem;
    }
    .task-add-schedule header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-bottom: .5rem;
        color: rgba(0, 0, 0, 0.575);
        font-size: 1.5rem;
        font-weight: 600;
        border-bottom: 1.5px solid rgba(0, 0, 0, 0.275);
    }
    .task-add-schedule div {
        position: relative;
        flex-direction: column;
        margin-top: .5rem;
    }
    .task-add-schedule .task-add-schedule-input {
        background-color: rgba(0, 0, 0, 0.575);
        color: #D8B885;
        border-color: transparent;
        max-width: 100% !important;
    }
    .task-add-schedule .task-add-schedule-button {
        position: absolute;
        top: 50%;
        right: .5rem;
        transform: translateY(-50%);
        padding: .4rem 0 .4rem .4rem;
        background-color: #564935;
        color: #D8B885;
        border: 0;
        border-radius: 0 1rem 1rem 0;
        pointer-events: none;
    }

    .task-font-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 0 !important;
        padding: .5rem;
        background-color: #bda17480;
        border-radius: .7rem;
    }
    .task-font-container header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding-bottom: .5rem;
        color: rgba(0, 0, 0, 0.575);
        font-size: 1.5rem;
        font-weight: 600;
        border-bottom: 1.5px solid rgba(0, 0, 0, 0.275);
        border-radius: .7rem .7rem 0 0;
    }

    .task-select-font {
        display: grid !important;
        grid-template-columns: calc(33.33% - .2rem) calc(33.33% - .2rem) calc(33.33% - .2rem);
        padding: .5rem 0 0;
        max-width: 100%;
    }

    @media (max-width: 768px) {
        .task-select-font {
            grid-template-columns: repeat(2, 49%) !important;
        }
    }
</style>