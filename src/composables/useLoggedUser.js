import { onMounted, onUnmounted, ref } from "vue";
import { subscribeToAuthChanges } from "../services/auth";

export function useLoggedUser() {
    let unsubscribeFromAuth = () => {};

    const loggedUser = ref({
        id: null,
        displayName: null,
        email: null,
        role: null,
        photoURL: null,
        phoneNumber: null
    });

    onMounted(() => {
        unsubscribeFromAuth = subscribeToAuthChanges(newUserData => loggedUser.value = newUserData);
    });

    onUnmounted(() => {
        unsubscribeFromAuth();
    });

    return { loggedUser };
}