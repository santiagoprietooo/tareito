<script setup>
import { useRouter } from 'vue-router';
import { signInWithGoogle } from '../services/auth';

const router = useRouter();
const openGooglePopup = async () => {
    try {
        await signInWithGoogle();
        router.push("/");
    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        throw error;
    }
}

defineProps({
    typeOfLogin: {
        type: String,
        default: "log-in"
    }
});
</script>

<template>
    <div class="login-p-method">
        <div>
            <hr>
            <p>o podés {{ typeOfLogin === "log-in" ? "registrarte" : "ingresar" }} desde <span><b>:</b></span></p>
            <hr>
        </div>

        <form action="#" @submit.prevent="openGooglePopup">
            <button type="submit">
                <img src="/Icons/google.png" alt="Logo de Google">
                <span>Ingresar con Google</span>
            </button>
        </form>

        <p class="redirect-to" v-if="typeOfLogin === 'log-in'">
            ¿Ya tenés una cuenta? <RouterLink to="/iniciar-sesion">Iniciá sesión acá.</RouterLink>
        </p>

        <p class="redirect-to" v-else>
            ¿Todavía no tenés una cuenta? <RouterLink to="/registro">Registrate acá.</RouterLink>
        </p>
    </div>
</template>

<style scoped>
    .login-p-method {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 2rem 2rem;
    }
    .login-p-method div {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }
    .login-p-method div hr {
        width: 100%;
        border: 1.5px solid rgba(0, 0, 0, 0.275);
    }
    .login-p-method div p {
        min-width: fit-content;
        color: rgba(0, 0, 0, 0.575);
        font-size: 1.2rem;
    }
    .login-p-method form {
        width: 100%;
    }
    .login-p-method button {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
        padding: .5rem 1rem;
        background-color: transparent;
        color: rgba(0, 0, 0, 0.650);
        font-size: 1.5rem;
        border-width: .1rem .375rem .350rem .1rem;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.575);
        border-radius: .750rem;
    }
    .login-p-method button:active {
        border: .185rem solid rgba(0, 0, 0, 0.625);
    }
    .login-p-method button:disabled {
        border-color: rgba(0, 0, 0, 0.250);
        border-width: .1rem .350rem .350rem .1rem;
    }
    .login-p-method img {
        height: 1.5rem;
        width: 1.5rem;
    }

    .redirect-to {
        color: rgba(0, 0, 0, 0.850);
        font-size: 1.2rem;
        text-align: center;
        text-decoration: none;
    }
    .redirect-to a {
        color: rgba(0, 0, 0, 0.850);
    }
</style>