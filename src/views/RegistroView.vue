<script setup>
import FormField from '../components/FormField.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { createUser, signInWithGoogle } from '../services/auth';

const newUser = ref({
    displayName: "",
    email: "",
    password: ""
});

const loading = ref(false);
const router = useRouter();
const errors = ref({ emailError: false, emailLengthError: false, passwordError: false });

const handleSubmit = async () => {
    if(loading.value) return;
    loading.value = true;

    try {
        await createUser({ ...newUser.value }, errors.value);

        router.push("/");
    } catch (error) {
        loading.value = false;

        if(error.code === "auth/email-already-in-use") {
            errors.value.emailError = true;
        }

        if(error.code === "auth/invalid-email") {
            errors.value.emailLengthError = true;
        }
        
        if(error.code === "auth/weak-password") {
            errors.value.passwordError = true;
        }
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
        <div class="div-forms">
            <h1>Registrarse</h1>

            <p class="div-forms-p">Los campos marcados con * son obligatorios para poder crear una cuenta.</p>

            <form @submit.prevent="handleSubmit" class="login-form">
                <FormField
                    useFor="displayName"
                    title="Nombre y apellido"
                    type="text"
                    placeholder="Juan Pérez"
                    autocomplete="on"
                    v-model="newUser.displayName"
                />

                <FormField
                    useFor="email"
                    title="Correo electrónico *"
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    autocomplete="on"
                    v-model="newUser.email"
                />

                <FormField
                    useFor="password"
                    title="Contraseña *"
                    type="password"
                    placeholder="Contraseña$10"
                    autocomplete="off"
                    v-model="newUser.password"
                />

                <RoundableButton :disabled="!newUser.email || !newUser.password">
                    {{ !loading ? "Crear cuenta" : "Creando cuenta..." }}
                </RoundableButton>
            </form>

            <div class="login-p-method">
                <div>
                    <hr>
                    <p>o podés registrarte desde <span><b>:</b></span></p>
                    <hr>
                </div>

                <form action="#" @submit.prevent="openGooglePopup">
                    <button type="submit">
                        <img src="/Icons/google.png" alt="Logo de Google">
                        <span>Ingresar con Google</span>
                    </button>
                </form>

                <p class="redirect-to">
                    ¿Ya tenés una cuenta? <RouterLink to="/iniciar-sesion">Iniciá sesión acá.</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>