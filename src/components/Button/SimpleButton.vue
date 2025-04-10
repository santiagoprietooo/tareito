<script setup>
defineProps({
    color: {
        type: String,
        default: 'black'
    }
});
</script>

<template>
    <button
        type="button"
        class="task-action-btn"
        :class="{
            'black'     : color == 'black',
            'orangered' : color == 'orangered'
        }"
    >
        <slot />
    </button>
</template>

<style>
.task-action-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: .5rem;
    background-color: transparent;
    font-size: 1.2rem;
    border: 0;
    border-radius: .3rem;
}
.task-action-btn:hover, .task-action-btn:focus {
    text-decoration: underline;
}
.task-action-btn:disabled {
    text-decoration: none;
}

.black {
    color: black;
}
.black:disabled {
    color: rgba(0, 0, 0, 0.50);
}

.orangered {
    color: orangered;
}
.orangered:disabled {
    color: rgba(255, 68, 0, 0.500);
}
</style>