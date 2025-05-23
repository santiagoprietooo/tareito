import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthChanges } from "../services/auth";
import InicioView from "../views/InicioView.vue";
import RegistroView from "../views/RegistroView.vue";
import IniciarSesionView from "../views/IniciarSesionView.vue";
import AyudaView from "../views/AyudaView.vue";
import NoEncontradoView from "../views/NoEncontradoView.vue";

const routes = [
    { path: "/",                   component: InicioView,   meta: { requiresAuth: true } },
    { path: "/registro",           component: RegistroView  },
    { path: "/iniciar-sesion",     component: IniciarSesionView },
    { path: "/ayuda",              component: AyudaView,    meta: { requiresAuth: true }},
    { path: "/:pathMatch(.*)*",    component: NoEncontradoView }
]

const router = createRouter({ routes, history: createWebHistory() });

let loggedUser = {
    id: null,
    displayName: null,
    email: null
}

subscribeToAuthChanges(userData => loggedUser = userData);

router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && loggedUser.id === null) {
        return { path: "/iniciar-sesion" };
    }

    if (loggedUser.id && (to.path === "/registro" || to.path === "/iniciar-sesion")) {
        return { path: "/" };
    }

    return true;
});


/* import NotesView from "../views/NotesView.vue";
import NoteView from "../views/NoteView.vue"; */
/* { path: "/notes",              component: NotesView,  meta: { requiresAuth: true } },
{ path: "/notes/:id/:title",   component: NoteView,  meta: { requiresAuth: true } }, */

export default router;