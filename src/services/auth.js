import { db, auth } from "./firebase";
import { collection, doc, getDocs, setDoc, query, where, getDoc } from "firebase/firestore";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

let loggedUser = {
    id: null,
    displayName: null,
    email: null,
}

if (localStorage.getItem('user-from-app')) {
    loggedUser = JSON.parse(localStorage.getItem('user-from-app'));
}

let observers = [];

onAuthStateChanged(auth, async user => {
    if(user) {
        updateLoggedUser({
            id: user.uid,
            displayName: user.displayName,
            email: user.email
        });
    } else {
        updateLoggedUser({
            id: null,
            displayName: null,
            email: null
        });

        localStorage.removeItem('user-from-app');
    }

    notifyAll();
});

/**
 * 
 * @param {{ displayName: string, email: string, password: string }} userData
 */
export async function createUser({ displayName, email, password }) {
    const user = collection(db, "users");

    try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password);
        const newUserRef = doc(db, `users/${newUser.user.uid}`);
        const newUserData = {
            id: newUser.user.uid,
            displayName: !displayName ? email.slice(0, email.indexOf("@")) : displayName,
            email: email
        }

        await setDoc(newUserRef, newUserData);
        await updateProfile(newUser.user, { displayName });

        console.log("[auth.js] - Se creó la cuenta con éxito. Datos del usuario: ", newUserData);
    } catch (error) {
        console.error("[auth.js] - Error al crear la cuenta:", error);
        throw error;
    }
}

export async function signIn({ email, password }) {
    try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log("[auth.js] - Se inició sesión con éxito. Datos del usuario: ", user);
    } catch (error) {
        console.error("[auth.js] - Error al iniciar sesión:", error);
        throw error;
    }
}

export async function signInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        const result = await signInWithPopup(auth, provider);
        if(result) {
            const user = result.user;
            const userRef = doc(db, `users/${user.uid}`);
            const userData = {
                id: user.uid,
                displayName: user.displayName,
                email: user.email
            }

            const userDoc = await getDoc(userRef);
            if(!userDoc.exists()) {
                await setDoc(userRef, userData);
            }
        }
    } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
            console.error("El usuario cerró el popup antes de completar el inicio de sesión.");
        } else {
            console.error("[auth.js] - Error al iniciar sesión con Google:", error);
        }        
        throw error;
    }
}

export async function logout() {
    await signOut(auth);
}

/**
 * @param {Function} callback
 * @returns {Function}
 */
export function subscribeToAuthChanges(callback) {
    observers.push(callback);
    notify(callback);

    return () => {
        observers = observers.filter(obs => obs !== callback);
    }
}

/**
 * Ejecuta el callback pasándole una copia de los datos del usuario
 * autenticado.
 * 
 * @param {Function} callback 
 */
function notify(callback) {
    callback({ ...loggedUser });
}

/**
 * Notifica a todos los observers.
 */
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/**
 * @param {{}} newData
 */
function updateLoggedUser(newData) {
    loggedUser = {
        ...loggedUser,
        ...newData,
    }
    localStorage.setItem('user-from-app', JSON.stringify(loggedUser));
    notifyAll();
}