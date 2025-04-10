import { createRouter, createWebHistory } from "vue-router";
import { subscribeToAuthChanges } from "../services/auth";
import HomeView from "../views/HomeView.vue";
/* import NotesView from "../views/NotesView.vue";
import NoteView from "../views/NoteView.vue"; */
import LoginView from "../views/LoginView.vue";
import SignInView from "../views/SignInView.vue";

const routes = [
    { path: "/",                   component: HomeView,   meta: { requiresAuth: true } },
    /* { path: "/notes",              component: NotesView,  meta: { requiresAuth: true } },
    { path: "/notes/:id/:title",   component: NoteView,  meta: { requiresAuth: true } }, */
    { path: "/login",              component: LoginView  },
    { path: "/sign-in",            component: SignInView }
];

const router = createRouter({ routes, history: createWebHistory() });

let loggedUser = {
    id: null,
    displayName: null,
    email: null
}

subscribeToAuthChanges(userData => loggedUser = userData);

router.beforeEach((to, from) => {
    if(to.meta.requiresAuth && loggedUser.id === null) {
        return { path: "/login" }
    }
});

export default router;