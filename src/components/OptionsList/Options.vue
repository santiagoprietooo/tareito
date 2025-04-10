<template>
    <li
        tabindex="0"
        role="button"
    >
        <slot />
    </li>
</template>

<style>
    .task-settings-bg ul li:hover {
        background-color: #FCF4E9;
        color: rgb(35, 35, 35);
        border-radius: .5rem 0 .5rem .5rem !important;
    }

    .task-settings li, .task-setting li {
        display: flex;
        align-items: center;
        gap: .5rem;
        width: 11.5rem;
        padding: .5rem;
        border-radius: .4rem 0 0;
        list-style-type: none;
        cursor: pointer;
    }
    .task-settings li:nth-of-type(2), .task-setting li:nth-of-type(2) {
        border-radius: 0 0 .4rem .4rem !important;
    }
    .task-settings li:hover, .task-setting li:hover {
        background-color: #bda174;
        color: rgb(35, 35, 35);
    }
    .task-settings li svg, .task-setting li svg {
        height: 1rem;
        width: 1rem;
    }
</style>