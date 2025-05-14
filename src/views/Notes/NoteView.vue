<script setup>
import RoundableButton from '../components/Button/RoundableButton.vue';
import { ref, onMounted } from 'vue';
import { useTitle } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { getNoteByID, editNoteByID } from '../../services/notes-by-user';
import FineBorderButton from '../components/Button/FineBorderButton.vue';
import { ChevronLeftIcon, Save } from 'lucide-vue-next';

const title = useTitle();

const route = useRoute();
const router = useRouter();
const routeID = route.params.id;

const noteData = ref(null);

onMounted(async () => {
    noteData.value = await getNoteByID(routeID);

    title.value = await noteData.value.title;
});

const handleSubmit = async () => {
    try {
        await editNoteByID(routeID, { title: noteData.value.title, content: noteData.value.content });
        router.push("/notes");
    } catch (error) {
        console.error("Error al guardar los cambios de la tarea: ", error);
        throw error;
    }
}
</script>

<template>
    <header class="note-header">
        <div>
            <FineBorderButton @click="router.go(-1)">
                <template #sr-only>
                    Volver para atrás
                </template>

                <ChevronLeftIcon />
            </FineBorderButton>

            <form action="" v-if="noteData">
                <div>
                    <label for="note-title" class="sr-only">Título:</label>
                    <input
                        type="text"
                        v-model="noteData.title"
                        name="note-title"
                        id="note-title"
                        class="textarea-style"
                        placeholder="Escribe un título..."
                        autocomplete="off"
                    />
                </div>
            </form>
        </div>

        <div>
            <ul>
                <li>Abrir</li>
                <li>Editar título</li>
                <li>Detalles</li>
                <li>Borrar</li>
            </ul>
        </div>
    </header>

    <div class="container-for-note">
        <form action="" class="form-class form-for-note" v-if="noteData">
            <label for="note-content" class="sr-only">Descripcion:</label>
            <textarea
                v-model="noteData.content"
                name="note-content"
                id="note-content"
                class="note-style"
                placeholder="Escriba el cuerpo..."
            />

            <FineBorderButton
                v-if="noteData"
                @click="handleSubmit"
                class="fixed-btn save-note-btn-style"
            >
                <template #sr-only>
                    Guardar nota
                </template>

                <Save />
            </FineBorderButton>
        </form>
    </div>
</template>