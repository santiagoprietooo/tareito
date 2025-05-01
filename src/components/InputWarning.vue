<script setup>
import { MailWarning, MailQuestionIcon, LockKeyholeIcon } from 'lucide-vue-next';

defineProps({
    icon: {
        type: String,
        default: "email"
    }
});
</script>

<template>
    <span class="input-warning">
        <MailWarning          class="hidden" :class="{ 'block' : icon == 'email' }" />
        <MailQuestionIcon     class="hidden" :class="{ 'block' : icon == 'email-length' }" />
        <LockKeyholeIcon      class="hidden" :class="{ 'block' : icon == 'password' }" />
        <p><slot/></p>
    </span>
</template>

<style>
.input-warning {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
    padding: .5rem 0;
    color: red;
    font-size: 1.1rem;
    font-weight: 500;
}
svg {
    height: 1.1rem;
    width: 1.1rem;
}

.hidden {
    display: none;
}
.block {
    display: block;
}
</style>