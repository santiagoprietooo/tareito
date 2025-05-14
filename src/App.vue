<script setup>
import { watchEffect } from "vue";
import { useRoute, RouterView } from "vue-router";
import { useTitle } from "@vueuse/core";

const route = useRoute();
const title = useTitle();

watchEffect(() => {
    switch (route.path) {
        case "/":
            title.value = "Tareín | Mis tareas";
            break;
        case "/registro":
            title.value = "Tareín | Crear cuenta";
            break;
        case "/iniciar-sesion":
            title.value = "Tareín | Iniciar sesión";
            break;
        case "/ayuda":
            title.value = "Tareín | Reportar un problema";
            break;
        default:
            title.value = "Error 404 | Página no encontrada";
            break;
    }
});
</script>

<template>
    <RouterView />
</template>