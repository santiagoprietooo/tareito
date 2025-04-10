<script setup>
import { MailWarning, LockKeyholeIcon } from 'lucide-vue-next';

defineProps({
    icon: {
        type: String,
        default: "email"
    }
});
</script>

<template>
    <span class="input-warning">
        <MailWarning     class="hidden" :class="{ 'block' : icon == 'email' }" />
        <LockKeyholeIcon class="hidden" :class="{ 'block' : icon == 'password' }" />
        <p><slot/></p>
    </span>
</template>

<style>
.input-warning {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    padding: .5rem;
    color: orangered;
    font-weight: 500;
}
svg {
    display: flex;
    justify-content: center;
    align-items: center;
}

.hidden {
    display: none;
}
.block {
    display: block;
}
</style>