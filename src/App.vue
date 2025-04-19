<script setup>
/* import Navbar from "./components/Navbar.vue"; */
import { watchEffect } from "vue";
import { useRoute, RouterView } from "vue-router";
import { useTitle } from "@vueuse/core";

const route = useRoute();

const title = useTitle();
const titles = {
    "/"        : " | Mis tareas",
    /* "/notes"   : " | Mis notas", */
    "/login"   : " | Crear cuenta",
    "/sign-in" : " | Iniciar sesión"
};

watchEffect(() => {
    title.value = !titles[route.path] ? "Cargando..." : `Tareín ${titles[route.path]}` || "Error | Página no encontrada";
});
</script>

<template>
    <!-- <Navbar v-if="route.path !== '/login' && route.path !== '/sign-in'"/> -->
    <RouterView />
</template>