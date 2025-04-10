<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { signIn } from '../services/auth';

const user = ref({
    email: "",
    password: ""
});

const toggleShowPassword = ref(false);
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
    if(loading.value) return;
    loading.value = true;

    try {
        await signIn({ ...user.value });
        router.push("/");
    } catch (error) {
        loading.value = false;
        console.error("[SignInView.vue] - Error al iniciar sesión:", error);
        throw error;
    }

    loading.value = false;
}
</script>

<template>
    <h1>Iniciar sesión</h1>

    <form @submit.prevent="handleSubmit">
        <div>
            <label for="email">Correo electrónico</label>
            <input
                id="email"
                name="email"
                type="email"
                autocomplete="on"
                v-model="user.email"
                placeholder="ejemplo@gmail.com"
            />
        </div>

        <div>
            <label for="password">Contraseña</label>
            <input
                id="password"
                name="password"
                :type="!toggleShowPassword ? 'password' : 'text'"
                v-model="user.password"
                placeholder="Contraseña$10"
            />

            <button
                type="button"
                @click="toggleShowPassword = !toggleShowPassword"
            >
                <span v-if="!toggleShowPassword">Mostrar</span>
                <span v-else>Ocultar</span>
            </button>
        </div>

        <div>
            <button type="submit">
                {{ !loading ? "Iniciar sesión" : "Iniciando sesión..." }}
            </button>
        </div>
    </form>

    <RouterLink to="/login">
        ¿No tenés una cuenta? Registrate acá.
    </RouterLink>
</template>