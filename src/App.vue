<script setup>
import { watchEffect } from "vue";
import { useRoute, RouterView } from "vue-router";
import { useTitle } from "@vueuse/core";

const route = useRoute();
const title = useTitle();

const titles = {
    "/"               : " | Mis tareas",
    "/registro"       : " | Crear cuenta",
    "/iniciar-sesion" : " | Iniciar sesión"
};

watchEffect(() => {
    title.value = !titles[route.path] ? "Cargando..." : `Tareín ${titles[route.path]}` || "Error | Página no encontrada";
});
</script>

<template>
    <RouterView />
</template>