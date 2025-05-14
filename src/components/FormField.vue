<script setup>
import FineBorderButton from './Button/FineBorderButton.vue';
import { ref } from 'vue';
import { Eye, EyeClosed } from 'lucide-vue-next';

const toggleShowPassword = ref(false);

defineProps({
    useFor: String,
    title: String,
    type: String,
    placeholder: String,
    autocomplete: String
});

defineEmits('inputValue');
const inputValue = defineModel();
</script>

<template>
    <div>
        <label :for="useFor">{{ title }}</label>
        <input
            v-if="type !== 'password'"
            :type="type"
            :name="useFor"
            :id="useFor"
            :placeholder="placeholder"
            :autocomplete="autocomplete"
            v-model="inputValue"
        />

        <div v-else class="password-input">
            <input
                :type="toggleShowPassword ? 'text' : 'password'"
                :name="useFor"
                :id="useFor"
                :placeholder="placeholder"
                :autocomplete="autocomplete"
                v-model="inputValue"
            />

            <FineBorderButton
                @click="toggleShowPassword = !toggleShowPassword"
                :class="{'active' : toggleShowPassword}"
            >
                <template #sr-only>{{ !toggleShowPassword ? "Mostrar contraseña" : "Ocultar contraseña" }} </template>

                <Eye v-if="!toggleShowPassword"/>
                <EyeClosed v-else/>
            </FineBorderButton>
        </div>

        <slot/>
    </div>
</template>

<style scoped>
    div {
        display: flex;
        flex-direction: column;
        align-items: start;
        width: 100%;
    }

    label {
        width: max-content;
        font-size: 1.2rem;
        font-weight: 600;
    }

    input {
        height: 2.5rem;
        width: 100%;
        padding: .3rem;
        background-color: transparent;
        color: rgba(0, 0, 0, 0.750);
        font-size: 1.2rem;
        border: 1.5px solid rgba(0, 0, 0, 0.275);
        border-radius: .7rem;
        outline: none;
        transition: all 0.2s ease-in-out;
    }

    input:focus {
        transition: all 0.2s ease-in-out;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    }

    input::placeholder {
        color: rgba(0, 0, 0, 0.420);
    }
    input:-webkit-autofill {
        background-color: #D8B885;
        color: rgba(0, 0, 0, 0.650);
        transition: background-color 500000s ease-in-out 0s;
    }
    input:-webkit-autofill:focus {
        background-color: #D8B885;
        color: rgba(0, 0, 0, 0.650);
    }
    input:-webkit-autofill:hover {
        background-color: #D8B885;
        color: rgba(0, 0, 0, 0.650);
    }

    .password-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
        width: 100%;
    }
</style>