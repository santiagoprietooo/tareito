<script setup>
import "../assets/CSS/NoEncontradoStyles.css";
import SimpleButton from '../components/Button/SimpleButton.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import { useLoggedUser } from '../composables/useLoggedUser';

const { loggedUser } = useLoggedUser();
</script>

<template>
    <main class="not-found">
        <section class="error-page">
            <div class="error-options">
                <header>
                    <h1>ERROR 404</h1>
                    <p>No pudimos encontrar la página que buscás.</p>
                </header>

                <div v-if="!loggedUser?.id" class="error-options-single-btn">
                    <SimpleButton @click="$router.push('/registro')">
                        Ir a la página de inicio
                    </SimpleButton>
                </div>

                <div v-else>
                    <SimpleButton @click="$router.push('/')">
                        Ir a "Mis Tareas"
                    </SimpleButton>

                    <RoundableButton @click="$router.push('/ayuda')" design="secondary">
                        Reportar un problema
                    </RoundableButton>
                </div>
            </div>

            <div class="error-container">
                <img src="/Icons/Tareín_preocupado-fondo_transparente.png" alt="Tareín indicando que no se encontró la página" class="error-container-tarein"/>

                <div class="error-container-text">
                    <img src="/Icons/globo_de_texto.png" alt="Globo de texto con un mensaje de error" class="error-container-text-img"/>
                    <p class="error-container-text-message">¿Dónde están <br> mis tareas?</p>
                </div>
            </div>
        </section>
    </main>
</template>