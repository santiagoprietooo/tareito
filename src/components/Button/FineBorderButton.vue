<template>
    <button
        type="button"
        class="fine-border-btn"
    >
        <span class="sr-only">
            <slot name="sr-only" />
        </span>
        <slot />
    </button>
</template>

<style>
.fine-border-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: .5rem;
    background-color: transparent;
    color: rgba(0, 0, 0, 0.575);
    font-size: 1rem;
    border: 1.5px solid rgba(0, 0, 0, 0.275);
    border-radius: .7rem;
    transition: .3s ease;
}
.fine-border-btn svg {
    height: 1rem;
    width: 1rem;
}

.fine-border-btn:focus {
    border-color: rgba(0, 0, 0, 0.775);
    box-shadow: 0 0 4px 0 black;
}

.active {
    background-color: rgba(0, 0, 0, 0.575);
    color: #D8B885;
    border-color: transparent;
}
.active-2 {
    background-color: rgba(0, 0, 0, 0.575);
    color: #FCF4E9;
    border-color: transparent;
}
</style>