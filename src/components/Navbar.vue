<script setup>
import FineBorderButton from '../components/Button/FineBorderButton.vue';
import SimpleButton from '../components/Button/SimpleButton.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import { LogOut } from 'lucide-vue-next';
import { ref } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { logout } from '../services/auth';

const openLogoutModal = ref(false);
const router = useRouter();
const route = useRoute();

const handleLogout = async () => {
    try {
        await logout();
        openLogoutModal.value = false;
        router.push("/iniciar-sesion");
    } catch (error) {
        console.error("[HomeView.vue] - Error al cerrar sesión:", error);
        throw error;
    }
}
</script>

<template>
    <nav class="navbar" v-if="!route.params.id">
        <ul>
            <li>
                <RouterLink to="/" :class="{ 'active-link' : route.path === '/' }">Tareas</RouterLink>
            </li>

            <li>
                <RouterLink to="/notes" :class="{ 'active-link' : route.path === '/notes' }">Notas</RouterLink>
            </li>
        </ul>

        <FineBorderButton @click="openLogoutModal = !openLogoutModal">
            <template #sr-only>Cerrar sesión</template>
            <LogOut />
        </FineBorderButton>
    </nav>

    <Transition name="logout-modal-bg">
        <div
            v-if="openLogoutModal"
            class="logout-modal-bg"
            @click="openLogoutModal = false"
        ></div>
    </Transition>

    <Transition name="logout-modal">
        <div v-if="openLogoutModal" class="logout-modal">
            <p>¿Querés cerrar sesión?</p>
            <div class="logout-btns">
                <SimpleButton @click="openLogoutModal = !openLogoutModal">
                    No, cancelar
                </SimpleButton>
                <form action="" @submit.prevent="handleLogout">
                    <RoundableButton design="secondary">
                        Sí, cerrar sesión
                    </RoundableButton>
                </form>
            </div>
        </div>
    </Transition>
</template>

<style>
.navbar {
    position: fixed;
    top: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1rem 2rem;
    background-color: #ab8f61;
}

.navbar ul {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}
.navbar li {
    list-style-type: none;
}
.navbar a {
    color: rgba(0, 0, 0, 0.575);
    font-size: 1.2rem;
    text-decoration: none;
}
.navbar a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .navbar a:hover {
        text-decoration: none;
    }
}

.active-link {
    text-decoration: underline !important;
}

.logout-modal-bg {
    position: absolute;
    z-index: 5;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.700);
}

.logout-modal {
    position: fixed;
    z-index: 6;
    top: calc(50% - 4rem);
    right: 50%;
    transform: translateX(50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;
    gap: 2rem;
    padding: 2rem;
    background-color: white;
    border-radius: .5rem;
}
.logout-modal p {
    font-size: 2rem;
}

.logout-btns {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: .5rem;
}

.logout-modal-bg-enter-active, .logout-modal-bg-leave-active {
    transition: opacity 0.3s ease;
}
.logout-modal-bg-enter-from, .logout-modal-bg-leave-to {
    opacity: 0;
}
.logout-modal-bg-enter-to, .logout-modal-bg-leave-from {
    opacity: 1;
}

.logout-modal-enter-active, .logout-modal-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
.logout-modal-enter-from {
    transform: translateX(-10%);
    opacity: 0;
}
.logout-modal-enter-to {
    transform: translateX(50%);
    opacity: 1;
}
.logout-modal-leave-from {
    transform: translateX(50%);
    opacity: 1;
}
.logout-modal-leave-to {
    transform: translateX(-10%);
    opacity: 0;
}
</style>