<script setup>
import { defineProps } from "vue";

defineProps({
    design: {
        type: String,
        default: 'main'
    }
});
</script>

<template>
    <button
        type="submit"
        class="roundable-btn"
        :class="{
            'main'      : design == 'main',
            'secondary' : design == 'secondary'
        }"
    >
        <slot />
    </button>
</template>

<style>
.roundable-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: max-content;
    padding: .3rem 1rem;
    font-size: 1.2rem;
    border-width: .1rem .375rem .350rem .1rem;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.575);
    border-radius: .750rem;
}
.roundable-btn:active {
    border: .185rem solid rgba(0, 0, 0, 0.625);
}
.roundable-btn:disabled {
    border-color: rgba(0, 0, 0, 0.250);
    border-width: .1rem .350rem .350rem .1rem;
}

.main {
    background-color: #FCF4E9;
}
.main:active {
    background-color: #feefd9;
}
.main:disabled {
    background-color: #fcf4e97b;
}

.secondary {
    background-color: #D8B885;
}
.secondary:active {
    background-color: #d7b277;
}
.secondary:disabled {
    background-color: #d8b88584;
}
</style>