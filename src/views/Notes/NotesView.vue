<script setup>
import Loader from '../components/Loader.vue';
import SimpleButton from '../components/Button/SimpleButton.vue';
import FineBorderButton from '../components/Button/FineBorderButton.vue';
import RoundableButton from '../components/Button/RoundableButton.vue';
import { BookOpen, CalendarDaysIcon, MoreVertical, Plus, TextCursorIcon, Trash, X } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { addNote, deleteNoteByID, editNoteTitleByID, getNotes } from '../../services/notes-by-user';
import { useLoggedUser } from '../../composables/useLoggedUser';
import { getDate } from '../../helpers/date';

const { loggedUser } = useLoggedUser();
const router = useRouter();

const loading = ref(false);
const redirect = ref(false);

const notes = ref([]);
const searchNote = ref("");
const searchNotes = computed(() => {
    const term = searchNote.value.toLowerCase().trim();

    if(term === "") {
        return notes.value;
    } else {
        return notes.value.filter((note) => {
            return (note.title.toLowerCase().includes(term))
        });
    }
});

const createNote = async () => {
    try {
        redirect.value = true;

        await addNote();
    } catch (error) {
        console.error("Error al querer crear una nota: ", error);
        throw error;
    }
}

const options = ref(null);
const openOptions = (id) => {
    if(!id) return;
    options.value = id;
} 
const toggleOptions = (id) => {
    if(options.value !== id) {
        return openOptions(id);
    } else {
        return options.value = null;
    }
}

const modal = ref(false);
const modalID = ref(null);
const modalMessage = ref(false);

const toggleDeleteNote = () => {
    modal.value = !modal.value;
    modalID.value = null;
    modalMessage.value = '';
}
const openDelete = (id, title) => {
    if(!id) return null;

    modal.value = true;
    modalID.value = id;
    modalMessage.value = `¿Estás seguro de que querés eliminar la nota <strong>"${title}"</strong>?`;

    options.value = null;
}
const handleDeleteNote = async () => {
    await deleteNoteByID(modalID.value);

    modal.value = !modal.value;
    modalID.value = null;
    modalMessage.value = '';
}

const modalTitle = ref(false);
const titleToEdit = ref("");

const toggleEditTitle = () => {
    modal.value = !modal.value;
    modalID.value = null;
    modalTitle.value = false;
    titleToEdit.value = '';
}
const openEditTitle = (id, title) => {
    if(!id) return null;

    modal.value = true;
    modalID.value = id;
    modalTitle.value = true;

    titleToEdit.value = title;
    options.value = null;
}
const editNoteTitle = async (id, title) => {
    try {
        await editNoteTitleByID(id, title);

        modal.value = false;
        modalID.value = null;
        modalTitle.value = false;

        titleToEdit.value = '';
    } catch (error) {
        console.error("Error al querer editar la nota con ID: ", id, error);
        throw error;
    }
}

onMounted(async () => {
    loading.value = true;

    await getNotes(loggedUser.value?.id, (data) => notes.value = data);
});

loading.value = false;
</script>

<template>
    <section>
        <header class="notes-header">
            <h1>Mis notas</h1>
            
            <div>
                <label for="search-note" class="sr-only">Buscar tarea</label>
                <input
                    type="search"
                    v-model="searchNote"
                    name="search-note"
                    id="search-note"
                    placeholder="Buscar nota..."
                    autocomplete="off"
                >
            </div>
        </header>

        <div class="loading-box" v-if="redirect">
            <Loader/>
        </div>

        <main class="notes-container" v-else>
            <div class="notes-display" v-if="notes.length > 0">
                <div
                    class="note-div"
                    :class="{ 'note-div-hover' : options !== note.id }"
                    v-for="note in searchNotes"
                    :key="note.id"
                    @contextmenu.prevent="toggleOptions(note.id)"
                >
                    <article
                        @click="router.push(`/notes/${note.id}/${note.title}`)"
                        @keydown.enter="router.push(`/notes/${note.id}/${note.title}`)"
                        tabindex="0"
                    >
                        <h2>{{ note.title.length > 29 ? note.title.slice(0, 25).trim() + "..." : note.title }}</h2>
                    </article>

                    <div class="note-info">
                        <span class="note-span">
                            <CalendarDaysIcon class="task-icon"/>

                            <small>
                                {{ note.created_at ? "Creada el " + getDate(new Date(note.created_at)) : "Cargando..." }}
                            </small>
                        </span>

                        <FineBorderButton
                            @click="toggleOptions(note.id)"
                            @keydown.enter="options !== note.id ? options = null : openOptions(note.id)"
                        >
                            <template #sr-only>
                                {{ options ? "Cerrar opciones de la tarea" : "Abrir opciones de la tarea" }}
                            </template>

                            <MoreVertical v-if="options !== note.id"/>
                            <X v-else/>
                        </FineBorderButton>
                    </div>

                    <Transition name="fade-x">
                        <div v-if="options === note.id" class="options" @mouseleave="options = null">
                            <button type="button" class="options-btn" @click="openEditTitle(note.id, note.title)">
                                <TextCursorIcon /> <span>Editar nombre</span>
                            </button>

                            <button type="button" class="options-btn" @click="openDelete(note.id, note.title)">
                                <Trash /> <span>Eliminar nota</span>
                            </button>

                            <RouterLink
                                class="options-btn"
                                :to="`/notes/${note.id}/${note.title}`"
                                @click="options = null"
                                target="_blank"
                            >
                                <BookOpen />
                                <span>Abrir en otra pestaña</span>
                            </RouterLink>
                        </div>
                    </Transition>
                </div>
            </div>
            
            <div v-else class="loading-box">
                <Loader v-if="loading"/>

                <p v-else>No creaste ninguna nota. Podés crear una presionando el botón de abajo a la derecha.</p>
            </div>

            <Transition name="fade">
                <div class="notes-modal-bg" v-if="modal && modalID && modalMessage">
                    <div class="notes-modal">
                        <div class="notes-modal-first-div">
                            <p v-html="modalMessage"/>

                            <FineBorderButton @click="toggleDeleteNote">
                                <template #sr-only>
                                    Cerrar mensaje de confirmación.
                                </template>

                                <X />
                            </FineBorderButton>
                        </div>

                        <form
                            action=""
                            @submit.prevent="handleDeleteNote"
                            class="notes-modal-form"
                        >
                            <SimpleButton @click="toggleDeleteNote">
                                Cancelar
                            </SimpleButton>

                            <RoundableButton design="secondary">
                                Confirmar
                            </RoundableButton>
                        </form>
                    </div>
                </div>
            </Transition>

            <Transition name="fade">
                <div class="notes-modal-bg" v-if="modal && modalID && modalTitle">
                    <div class="notes-modal translate-form">
                        <div class="notes-modal-first-div">
                            <FineBorderButton @click="toggleEditTitle">
                                <template #sr-only>
                                    Cerrar formulario de edición.
                                </template>

                                <X />
                            </FineBorderButton>
                        </div>

                        <form
                            action=""
                            @submit.prevent="editNoteTitle(modalID, titleToEdit)"
                            class="notes-modal-edit-form"
                        >
                            <div>
                                <label for="edit-note-title">Editar título:</label>
                                <input
                                    type="text"
                                    v-model="titleToEdit"
                                    name="edit-note-title"
                                    id="edit-note-title"
                                    placeholder="Editá el título de la nota"
                                    autocomplete="off"
                                >
                            </div>

                            <div>
                                <SimpleButton @click="toggleEditTitle">
                                    Cancelar
                                </SimpleButton>

                                <RoundableButton design="secondary" :disabled="!titleToEdit">
                                    Confirmar
                                </RoundableButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </main>

        <Transition name="fade-y">
            <FineBorderButton
                @click="createNote"
                class="fixed-btn create-btn-style"
            >
                <template #sr-only>
                    Crear tarea
                </template>

                <Plus />
            </FineBorderButton>
        </Transition>
    </section>
</template>