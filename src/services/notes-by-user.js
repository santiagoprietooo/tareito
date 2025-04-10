import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * 
 * @param {string} id
 * @param {Function} callback
 * @returns {Promise}
 */
export async function getNotes(id, callback) {
    if(!id) {
        console.error("No estás registrado: ", id);
        return;
    }

    const notesRef = collection(db, "notes");
    const notesQuery = query(notesRef, where("user_id", "==", id), orderBy("created_at", "desc"));

    onSnapshot(notesQuery, snapshot => {
        const notes = snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            user_id: doc.data().user_id,
            created_at: doc.data().created_at?.toDate()
        }));

        callback(notes);
    })
}

export async function addNote() {
    try {
        const ref = collection(db, "notes");
        const noteData = {
            title: "Sin título",
            content: null,
            user_id: auth.currentUser?.uid,
            created_at: serverTimestamp()
        }

        const note = await addDoc(ref, noteData);
        console.log("Se creó la nota: ", note);

        window.location.pathname = `/notes/${note.id}/${noteData.title}`;
    } catch (error) {
        console.error("Error al crear una nota: ", error);
        throw error;
    }
}

/**
 * 
 * @param {string} id
 * @returns {Promise}
 */
export async function getNoteByID(id) {
    try {
        const note = doc(db, `/notes/${id}`);
        const noteSnapshot = await getDoc(note);

        if(noteSnapshot.exists()) {
            console.log(`La nota con ID ${id} fue encontrada.`);
            return noteSnapshot.data();
        } else {
            console.error("Esta tarea no existe...");
            return null;
        }
    } catch (error) {
        console.error("Error al buscar la nota con ID: ", id, error);
        throw error;
    }
}

/**
 * 
 * @param {string} id
 * @param {{ title: string, content: string|null }} data
 */
export async function editNoteByID(id, { title, content }) {
    try {
        const note = doc(db, `/notes/${id}`);

        if(!content) {
            content = null;
        }

        await updateDoc(note, { title, content });

        console.log(`La nota con ID ${id} ha sido editada y guardada.`);
    } catch (error) {
        console.error("Error al buscar la nota con ID: ", id, error);
        throw error;
    }
}

/**
 * 
 * @param {string} id
 * @param {string} title
 */
export async function editNoteTitleByID(id, title) {
    try {
        const note = doc(db, `/notes/${id}`);

        await updateDoc(note, { title: title });

        console.log(`La nota con ID ${id} ha sido editada y guardada.`);
    } catch (error) {
        console.error("Error al buscar la nota con ID: ", id, error);
        throw error;
    }
}

/**
 * 
 * @param {string} id 
 */
export async function deleteNoteByID(id) {
    try {
        const note = doc(db, `/notes/${id}`);
        await deleteDoc(note);

        console.log("Se eliminó la nota con el ID", id);
    } catch (error) {
        console.error("Error al eliminar la nota con ID: ", id, error);
        throw error;
    }
}