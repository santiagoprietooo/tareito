<script setup>
import FineBorderButton from '../components/Button/FineBorderButton.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import InputWarning from '../components/InputWarning.vue';
import { Eye, EyeClosed } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { createUser, signInWithGoogle } from '../services/auth';

const newUser = ref({
    displayName: "",
    email: "",
    password: ""
});

const toggleShowPassword = ref(false);
const loading = ref(false);
const router = useRouter();
const errors = ref({ emailError: false, passwordError: false });

const handleSubmit = async () => {
    if(loading.value) return;
    loading.value = true;

    try {
        await createUser({ ...newUser.value }, errors.value);

        if(errors.value.emailError) {
            loading.value = false;
            return;
        }

        router.push("/");
    } catch (error) {
        loading.value = false;
        console.error("[LoginView.vue] - Error al crear la cuenta:", error);
    }

    loading.value = false;
}

const openGooglePopup = async () => {
    try {
        await signInWithGoogle();
        router.push("/");
    } catch (error) {
        console.error("[LoginView.vue] - Error al iniciar sesión con Google:", error);
        throw error;
    }
}
</script>

<template>
    <div class="wrap">
        <div class="div-forms pt-0">
            <h1>Registrarse</h1>

            <form @submit.prevent="handleSubmit" class="login-form">
                <div>
                    <label for="displayName"><b>Nombre:</b></label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        autocomplete="on"
                        v-model="newUser.displayName"
                        placeholder="Juan Pérez"
                    />
                </div>

                <div>
                    <label for="email"><b>Correo electrónico:</b></label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="on"
                        v-model="newUser.email"
                        placeholder="ejemplo@gmail.com"
                    />
                    <InputWarning v-if="errors.emailError == true">El email ya se encuentra en uso, pruebe con otro.</InputWarning>
                </div>

                <div class="password-input">
                    <label for="password"><b>Contraseña:</b></label>
                    <div>
                        <input
                            id="password"
                            name="password"
                            :type="!toggleShowPassword ? 'password' : 'text'"
                            v-model="newUser.password"
                            placeholder="Contraseña$10"
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
                    <InputWarning
                        icon="password"
                        v-if="errors.passwordError == true"
                    >
                        La contraseña debe tener al menos seis carácteres.
                    </InputWarning>
                </div>

                <RoundableButton :disabled="!newUser.email || !newUser.password">
                    {{ !loading ? "Crear cuenta" : "Creando cuenta..." }}
                </RoundableButton>
            </form>

            <div class="login-p-method">
                <div>
                    <hr> <p>o podés registrarte desde <span><b>:</b></span></p> <hr>
                </div>

                <form action="" @submit.prevent="openGooglePopup">
                    <button type="submit">
                        <img src="/Icons/google.png" alt="Logo de Google">
                        <span>Ingresar con Google</span>
                    </button>
                </form>

                <RouterLink to="/iniciar-sesion" class="redirect-to">
                    ¿Ya tenés una cuenta? Iniciá sesión acá.
                </RouterLink>
            </div>
        </div>
    </div>
</template>