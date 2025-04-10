<template>
    <ul>
        <slot />
    </ul>
</template>

<style>
    .task-settings ul, .task-setting ul {
        position: absolute;
        top: 0;
        right: 3rem;
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: start;
        width: max-content;
        background-color: rgb(35, 35, 35);
        color: #D8B885;
        border-radius: .5rem 0 .5rem .5rem;
        box-shadow: 0 0 7px black;
        transition: .3s ease-in-out;
    }

    .task-settings-bg ul {
        background-color: rgb(35, 35, 35);
        color: #FCF4E9;
    }
</style>