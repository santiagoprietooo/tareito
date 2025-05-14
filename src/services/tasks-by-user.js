import { db, auth } from "./firebase";
import { collection, doc, addDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, onSnapshot, query, where, orderBy } from "firebase/firestore";

/**
 *  Función que crea una nueva tarea.
 * @param {{ title: string, isScheduled: string|null, font: string, completed: boolean }} task
 * @return {Promise}
 */
export async function addTask({ title, isScheduled, font, completed }) {
    const taskRef = collection(db, "tasks");
    const taskData = { user_id: auth.currentUser?.uid, title, isScheduled, font, completed, created_at: serverTimestamp() };

    if(!auth.currentUser?.uid) {
        return;
    }

    await addDoc(taskRef, taskData);
}

/**
 *  Función que obtiene todas las tareas creadas por el usuario actual.
 * @param {string} userId - ID del usuario autenticado.
 * @param {Function} callback
 * @returns {Function}
 */
export async function getTasks(userId, callback) {
    if (!userId) {
        throw new Error("[tasks-by-user.js] - El ID del usuario es requerido. ID: ", userId);
    }

    const tasks = collection(db, "tasks");
    const taskQuery = query(tasks, where("user_id", "==", userId), orderBy("created_at", "desc"));

    onSnapshot(taskQuery, snapshot => {
        const task = snapshot.docs.map(doc => ({
            id: doc.id,
            user_id: doc.data().user_id,
            title: doc.data().title,
            isScheduled: doc.data().isScheduled,
            font: doc.data().font,
            completed: doc.data().completed,
            created_at: doc.data().created_at?.toDate()
        }));
        callback(task);
    });
}

/**
 * Función que obtiene una tarea mediante ID.
 * @param {string} id 
 * @returns {Promise}
 */
export async function getTaskByID(id) {
    try {
        const taskRef = doc(db, `/tasks/${id}`);
        const taskSnapshot = await getDoc(taskRef);

        if(taskSnapshot.exists()) {
            return taskSnapshot.data();
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}

/**
 *  Borra una tarea mediante ID.
 * @param {string} id
 */
export async function deleteTaskByID(id) {
    try {
        const taskRef = doc(db, `/tasks/${id}`);
        await deleteDoc(taskRef);
    } catch (error) {
        throw error;
    }
}

/**
 *  Edita una tarea mediante ID.
 * @param {string} id
 * @param {{ title: string, isScheduled: string|null, completed: boolean }} newTaskData
 */
export async function editTaskByID(id, { title, isScheduled, font, completed }) {
    try {
        const taskRef = doc(db, `/tasks/${id}`);

        if(!isScheduled) {
            isScheduled = null;
        }

        await updateDoc(taskRef, { title, isScheduled, font, completed });
    } catch (error) {
        throw error;
    }
}