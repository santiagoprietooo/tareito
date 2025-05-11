<script setup>
import FormField from '../components/FormField.vue';
import InputWarning from '../components/InputWarning.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import SignInWithGoogle from '../components/SignInWithGoogle.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signIn } from '../services/auth';

const user = ref({
    email: "",
    password: ""
});

const loading = ref(false);
const router = useRouter();
const errors = ref({ emailError: false, passwordError: false });

const handleSubmit = async () => {
    if(loading.value) return;

    errors.value = { emailError: false, passwordError: false };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.value.email)) {
        errors.value.emailError = true;
    }

    if (user.value.password.length < 6) {
        errors.value.passwordError = true;
    }

    if (errors.value.emailError || errors.value.passwordError) {
        return;
    }

    loading.value = true;

    try {
        await signIn({ ...user.value });
        router.push("/");
    } catch (error) {
        if(error.code === "auth/invalid-email") {
            errors.value.emailError = true;
        }

        if(error.code === "auth/invalid-credential") {
            errors.value.passwordError = true;
        }
    }

    loading.value = false;
}
</script>

<template>
    <div class="wrap">
        <div class="div-forms">
            <header>
                <h1>Iniciar sesión</h1>
            </header>

            <form @submit.prevent="handleSubmit" class="login-form">
                <FormField
                    useFor="email"
                    title="Correo electrónico"
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    autocomplete="on"
                    v-model="user.email"
                >
                    <InputWarning v-if="errors.emailError" message="El correo electrónico no es válido."/>
                </FormField>

                <FormField
                    useFor="password"
                    title="Contraseña"
                    type="password"
                    placeholder="Contraseña$10"
                    autocomplete="off"
                    v-model="user.password"
                />

                <InputWarning v-if="errors.passwordError" message="Estas credenciales no son válidas"/>

                <RoundableButton :disabled="!user.email || !user.password">
                    {{ loading ? "Cargando..." : "Iniciar sesión" }}
                </RoundableButton>
            </form>

            <SignInWithGoogle typeOfLogin="sign-in"/>
        </div>

        <div class="login-section">
            <header>
                <h2>¡Bienvenido!</h2>
                <p>Gracias por volver, <b>¡te estábamos esperando!</b> Seguí disfrutando de <b>Tareín</b> y todos sus beneficios.</p>
            </header>

            <div class="login-section-image">
                <img src="/Icons/Tareín-fondo_transparente.png" alt="Logo de Tareín"/>
            </div>
        </div>
    </div>
</template>