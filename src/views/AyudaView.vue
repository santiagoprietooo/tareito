<script setup>
import '../assets/CSS/AyudaStyles.css';
import FormField from '../components/FormField.vue';
import StylizedTextarea from '../components/StylizedTextarea.vue';
import SimpleButton from '../components/Button/SimpleButton.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import Loader from '../components/Loader.vue';
import { ref } from 'vue';
import { useLoggedUser } from '../composables/useLoggedUser';
import emailjs from 'emailjs-com';
import FineBorderButton from '../components/Button/FineBorderButton.vue';
import { ChevronLeft } from 'lucide-vue-next';

const loading = ref(false);
const showMessage = ref(false);

const { loggedUser } = useLoggedUser();
const help = ref({
    motive: '',
    details: ''
});

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const handleSubmit = async () => {
    if(loading.value) return;

    try {
        loading.value = true;

        await emailjs.send("tarein_support", "tarein-auto_reply", {
            name: loggedUser.value?.displayName,
            email: loggedUser.value?.email
        }, PUBLIC_KEY);

        await emailjs.send("tarein_support", "tarein-support_message", {
            name: loggedUser.value?.displayName,
            reply_to: loggedUser.value?.email,
            motive: help.value.motive,
            details: help.value.details
        }, PUBLIC_KEY);

        showMessage.value = true;

        help.value = {
            motive: '',
            details: ''
        };
    } catch (error) {
        throw error;
    }

    loading.value = false;
};
</script>

<template>
    <header class="help-page-header">
        <FineBorderButton @click="$router.push('/')">
            <template #sr-only>
                Volver al inicio
            </template>

            <ChevronLeft />
        </FineBorderButton>
    </header>

    <main class="help-page">
        <section class="help-container">
            <header v-if="!showMessage && !loading" class="help-container-header">
                <h1>Reportar un problema</h1>
                <p>
                    Escribinos el motivo de tu consulta <br class="help-container-header-break-1"/>
                    y el inconveniente que estás teniendo <br class="help-container-header-break-2"/>
                    con nuestra aplicación y/o su uso.
                </p>
            </header>

            <form v-if="!showMessage && !loading" action="" class="help-container-form" @submit.prevent="handleSubmit">
                <FormField
                    useFor="motive"
                    title="Motivo de la consulta"
                    type="text"
                    placeholder="Escribinos el motivo de tu consulta"
                    autocomplete="off"
                    v-model="help.motive"
                />

                <StylizedTextarea
                    textType="motive-details"
                    font="default"
                    v-model="help.details"
                    @submitForm="handleSubmit"
                />

                <div>
                    <RoundableButton :disabled="help.motive.length === 0 || help.details.length === 0">
                        Enviar consulta
                    </RoundableButton>
                </div>
            </form>

            <div class="help-container-loader">
                <Loader v-if="loading"/>
            </div>

            <div class="help-container-success-message" v-if="showMessage">
                <img src="/Icons/Tareín-fondo_transparente.png" alt="Logo de Tareín"/>
                <p>
                    Gracias por enviarnos tu consulta. Nuestro equipo responderá lo antes posible.
                    En caso de que quieras volver a leer tu consulta te envíamos un mail a:
                    <b>{{ loggedUser?.email }}</b> con los detalles de tu mensaje.
                </p>

                <div class="help-container-success-message-buttons">
                    <SimpleButton @click="$router.push('/')">
                        Volver al inicio
                    </SimpleButton>

                    <RoundableButton @click="showMessage = !showMessage">
                        Enviar otra consulta
                    </RoundableButton>
                </div>
            </div>
        </section>
    </main>
</template>