<script setup>
import FormField from '../components/FormField.vue';
import InputWarning from '../components/InputWarning.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import SignInWithGoogle from '../components/SignInWithGoogle.vue';
import Paper from '../components/Paper.vue';
import { CircleCheckBigIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUser } from '../services/auth';

const newUser = ref({
    displayName: "",
    email: "",
    password: ""
});

const loading = ref(false);
const router = useRouter();
const errors = ref({
    emailError: false,
    emailLengthError: false,
    passwordError: false
});

const handleSubmit = async () => {
    if(loading.value) return;

    errors.value = { emailError: false, emailLengthError: false, passwordError: false };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.value.email)) {
        errors.value.emailLengthError = true;
    }

    if (newUser.value.password.length < 6) {
        errors.value.passwordError = true;
    }

    if (errors.value.emailLengthError || errors.value.passwordError) {
        return;
    }

    loading.value = true;

    try {
        await createUser({ ...newUser.value });
        router.push("/");
    } catch (error) {
        if(error.code === "auth/email-already-in-use") {
            errors.value.emailError = true;
        }

        if(error.code === "auth/invalid-email") {
            errors.value.emailLengthError = true;
        }
    }

    loading.value = false;
}

const benefits = [
    "Acceso a tus tareas desde cualquier dispositivo.",
    "Interfaz intuitiva y fácil de usar.",
    "Recordatorios y notificaciones inteligentes.",
    "Clasificación y priorización de tareas.",
    "Seguimiento de progreso en tiempo real."
];
</script>

<template>
    <div class="wrap">
        <div class="div-forms">
            <header>
                <h1>Registrarse</h1>
                <p class="div-forms-p">Los campos marcados con * son obligatorios para poder crear una cuenta.</p>
            </header>

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
                >
                    <InputWarning v-if="errors.emailError" message="El correo electrónico ya está en uso." />
                    <InputWarning v-else-if="errors.emailLengthError" message="Este no es un correo electrónico válido." />
                </FormField>

                <FormField
                    useFor="password"
                    title="Contraseña *"
                    type="password"
                    placeholder="Contraseña$10"
                    autocomplete="off"
                    v-model="newUser.password"
                >
                    <InputWarning v-if="errors.passwordError" message="La contraseña debe tener al menos 6 (seis) carácteres." />
                </FormField>

                <RoundableButton :disabled="!newUser.email || !newUser.password">
                    {{ !loading ? "Crear cuenta" : "Creando cuenta..." }}
                </RoundableButton>
            </form>

            <SignInWithGoogle typeOfLogin="log-in"/>
        </div>

        <section class="login-section">
            <header>
                <h2>¿Por qué crear una cuenta?</h2>
                <p><b>Tareín</b> es una aplicación web diseñada para ayudarte a gestionar tus tareas de forma simple y efectiva. <strong>Acá vas a encontrar beneficios y características como:</strong></p>
            </header>

            <Paper>
                <li v-for="(benefit, index) in benefits" :key="index" class="paper-list-item">
                    <span><CircleCheckBigIcon class="paper-list-icon"/></span>
                    {{ benefit }}
                </li>
            </Paper>

            <footer class="login-footer">
                <h3>¿Qué estás esperando para unirte?</h3>
                <p>Crear una cuenta es gratis y te toma <b>¡menos de un minuto!</b> Además, podés utilizar una <b>cuenta de google</b> para hacer el proceso de forma más rápida.</p>
            </footer>
        </section>
    </div>
</template>