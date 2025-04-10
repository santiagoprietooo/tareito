<script setup>
import { AlarmCheck, CalendarDaysIcon, CircleCheck, XCircle } from 'lucide-vue-next';
import { getDate, getHour } from '../helpers/date';

defineProps({
    infoType: String,
    detail: String,
    font: String,
    isCompleted: Boolean,
    scheduled: String,
    created: Date
});
</script>

<template>
    <h2 v-if="infoType === 'title'" class="title" :class="[font, { 'line-through' : isCompleted } ]">{{ detail }}</h2>

    <div v-else-if="infoType === 'schedule' && scheduled" class="task-info">
        <AlarmCheck class="task-icon"/>

        <p>
            <small>
                Programada para el <b>{{ getDate(scheduled) }}</b> a las <b>{{ getHour(scheduled) }}</b>
            </small>
        </p>
    </div>

    <div v-else-if="infoType === 'complete'" class="task-info">
        <CircleCheck v-if="isCompleted"/>
        <XCircle v-else/>

        <span>
            <b>{{ isCompleted ? 'REALIZADA' : 'PENDIENTE' }}</b>
        </span>
    </div>

    <div v-else class="task-info">
        <CalendarDaysIcon v-if="created" class="task-icon"/>

        <p v-if="!created">
            <small>Cargando...</small>
        </p>
        <p v-else>
            <small>
                <span>Creada el {{ getDate(created) }} a las {{ getHour(created) }}</span>
            </small>
        </p>
    </div>
</template>

<style>
    .title {
        display: flex;
        align-items: end;
        min-height: 2.5rem;
        width: 100%;
        border-top: 1.5px solid rgba(0, 0, 0, 0.275);
        border-bottom: 1.5px solid rgba(0, 0, 0, 0.275);
    }

    .task-info {
        display: flex;
        flex-direction: row;
        align-items: end;
        gap: .5rem;
        height: 2.5rem;
        width: 100%;
        padding-bottom: .3rem;
        border-bottom: 1.5px solid rgba(0, 0, 0, 0.275);
    }

    .task-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.2rem;
        height: 1.2rem;
    }
</style>