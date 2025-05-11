<script setup>
import Loader from "../components/Loader.vue";
import SimpleButton from "../components/Button/SimpleButton.vue";
import FineBorderButton from "../components/Button/FineBorderButton.vue";
import RoundableButton from "../components/Button/RoundableButton.vue";
import OptionsList from "../components/OptionsList/OptionsList.vue";
import Options from "../components/OptionsList/Options.vue";
import AddOptionForTask from "../components/AddOptionForTask.vue";
import StylizedTextarea from "../components/StylizedTextarea.vue";
import TaskInfo from "../components/TaskInfo.vue";
import clickOutside from "../directives/clickOutside";
import { Settings2, ChevronLeft, PenTool, AlarmClockIcon, TypeIcon, MoreVertical, XCircle, AlarmCheck, AlarmClockOff, Circle, X, Calendar1, Trash2, CircleCheckIcon, Pencil, LogOut, Menu } from "lucide-vue-next";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useBreakpoints } from "@vueuse/core";
import { addTask, getTasks, getTaskByID, deleteTaskByID, editTaskByID } from "../services/tasks-by-user";
import { useLoggedUser } from "../composables/useLoggedUser";
import { logout } from "../services/auth";

const { loggedUser } = useLoggedUser();

const tasks = ref([]);
const loadTasks = ref(false);
const loading = ref(false);

const router = useRouter();

onMounted(() => {
    if(loggedUser.value?.id) {
        getTasks(loggedUser.value.id, (task) => { tasks.value = task; loadTasks.value = true });

        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    } else {
        router.push("/registro");
    }

    loadTasks.value = false;
});

const openTaskSettings = ref(false);
function closeTaskOptions() {
    openTaskSettings.value = false;
}

const openScheduleTask = ref(false);
const openFontSelector = ref(false);

const typeOfFont = [
    { font: 'Preestablecida',           class: 'default'                   },
    { font: 'Arial',                    class: 'arial'                     },
    { font: 'Franklin Gothic Medium',   class: 'franklin-gothic-medium'    },
    { font: 'Courier New',              class: 'courier-new'               },
    { font: 'Monospace',                class: 'monospace'                 },
    { font: 'Times New Roman',          class: 'times-new-roman'           }
]

const newTask = ref({
    title: "",
    isScheduled: null,
    font: 'default',
    completed: false
});

const order = ref('mas-reciente');
function orderByNewest() {
    tasks.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
function orderByOlders() {
    tasks.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
function orderByA_Z() {
    tasks.value.sort((a, b) => a.title.localeCompare(b.title));
}
function orderByZ_A() {
    tasks.value.sort((a, b) => b.title.localeCompare(a.title));
}
function orderBy(event) {
    const option = event.target.value;

    if(option == "mas-reciente") {
        orderByNewest();
    } else if (option == "mas-antigua") {
        orderByOlders();
    } else if (option == "a-z") {
        orderByA_Z();
    } else {
        orderByZ_A();
    }
}

const notificationMessage = ref("");
const alertMessage = ref(null);

const handleSubmit = async () => {
    if (loading.value) return;
    loading.value = true;

    try {
        await addTask({...newTask.value});

        if(newTask.value.isScheduled) {
            scheduleNotification({...newTask.value});
        }

        notificationMessage.value = "La tarea fue creada correctamente.";
        setTimeout(() => {
            notificationMessage.value = "";
        }, 5000);


        newTask.value = {
            title: "",
            isScheduled: null,
            font: 'default',
            completed: false
        };

        order.value = "mas-reciente";

        openScheduleTask.value = false;
        openFontSelector.value = false;
        editTask.value = null;
        enableSelectTasks.value = false;
        openTaskOptions.value = false;

        createBtn.value = false;
    } catch (error) {
        console.error("[HomeView.vue] - Error al crear la tarea: ", error);
        throw error;
    }

    loading.value = false;
};

const openTaskOptions = ref(false);
function handleCloseTaskOptions() {
    openTaskOptions.value = false;
}

const confirmDelete = ref(null);
const openConfirmDelete = (id) => {
    if(!id) {
        console.error("No hay un ID proporcionado: ", id);
    } else {
        confirmDelete.value = id;
    }
}

const enableSelectTasks = ref(false);
const tasksToDelete = ref([]);
const handleDeleteTasks = () => {
    tasksToDelete.value.forEach(async (task) => {
        notificationMessage.value = "";

        await deleteTaskByID(task);

        if(tasksToDelete.value.length === 1) {
            notificationMessage.value = `Se borró <strong>una</strong> tarea de tu lista.`;
        } else if (tasksToDelete.value.length > 1) {
            notificationMessage.value = `Se borraron <strong>${tasksToDelete.value.length}</strong> tareas de tu lista.`;
        }

        setTimeout(() => {
            notificationMessage.value = "";
            tasksToDelete.value.length = 0;
        }, 5000);
    });

    enableSelectTasks.value = false;
    openTaskOptions.value = false;
}

const deletedTaskMessage = (title) => {
    if(title.length > 35) {
        title = title.slice(0, 35) + "...";
    }

    notificationMessage.value = `Se borró <strong>"${title}"</strong> de tu lista de tareas.`

    setTimeout(() => {
        notificationMessage.value = "";
    }, 5000);
}

const editTask = ref(null);
const taskDetails = ref(null);

const openEditTask = async (id) => {
    if (!id) {
        console.error(`[HomeView.vue] - No se pasó ningún ID.`);
        return;
    } else {
        taskDetails.value = await getTaskByID(id);
        editTask.value = id;
    }
};

const scheduleInEdit = ref(null);
const fontInEdit = ref(false);

const toggleAddSchedule = () => {
    openTaskSettings.value = !openTaskSettings.value;
    openScheduleTask.value = !openScheduleTask.value;
    newTask.value.isScheduled = null;
}
const toggleSchedule = (id) => {
    if(!scheduleInEdit.value && !taskDetails.value.isScheduled) {
        scheduleInEdit.value = id;
    } else {
        scheduleInEdit.value = null;
        taskDetails.value.isScheduled = null;
    }
}


const toggleEditFont = () => {
    openFontSelector.value = !openFontSelector.value;
    openTaskSettings.value = !openTaskSettings.value;
}
const submitEditedTask = async (id, title, isScheduled, font, completed) => {
    try {
        notificationMessage.value = "";

        await editTaskByID(id, { title, isScheduled, font, completed });
        editTask.value = false;
        scheduleInEdit.value = null;
        fontInEdit.value = false;

        notificationMessage.value = `Se editó la tarea.`

        setTimeout(() => {
            notificationMessage.value = "";
        }, 5000);
    } catch (error) {
        console.error(`[HomeView.vue] - Error al querer editar la tarea con ID ${id}.`, error);
        throw error;
    }
}

const breakpoints = useBreakpoints({ mobile: 0, tablet: 875, laptop: 1024, desktop: 1280 });
const devices = breakpoints.between("mobile", "tablet");

const createBtn = ref(false);

const returnBtnForDevices = () => {
    createBtn.value = !createBtn.value;
    openTaskSettings.value = false;
    openScheduleTask.value = false;
    openFontSelector.value = false;
    newTask.value.title = '';
    newTask.value.font = 'default';
}

const notifiedTasksIDs = ref(new Set());

const sendNotification = async (task) => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn("Notificaciones o Service Worker no están soportados en este navegador.");
        return;
    }

    let permission = Notification.permission;
    if (permission !== 'granted') {
        try {
            permission = await Notification.requestPermission();
        } catch (err) {
            console.error("Error solicitando permiso de notificación:", err);
            return;
        }
    }

    if (permission === 'granted') {
        try {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification("Tenés una tarea programada", {
                body: task,
                icon: "/icons/Tareín-fondo_blanco.jpg",
                badge: "/icons/Tareín-fondo_blanco.jpg",
                lang: "es-ES",
                silent: false,
                vibrate: [200, 100, 200],
                requireInteraction: false
            });
        } catch (err) {
            console.error("Error al mostrar la notificación:", err);
        }
    }
};

function scheduleNotification(task) {
    const scheduledTime = new Date(task.isScheduled);
    const now = Date.now();
    const delay = scheduledTime - now;

    if (delay > 0) {
        setTimeout(() => {
            sendNotification(task.title);
            notifiedTasksIDs.value.add(task.id);
        }, delay);
    }
}

watch(tasks, (newTasks) => {
    newTasks.forEach((task) => {
        if (!notifiedTasksIDs.value.has(task.id)) {
            scheduleNotification(task);
        }
    });
}, { immediate: true });

const openMenu = ref(false);
const toggleMenu = () => {
    openMenu.value = !openMenu.value;
}

const openLogout = ref(false);
const handleLogout = async () => {
    try {
        await logout();
        router.push("/iniciar-sesion");
    } catch (error) {
        console.error("[InicioView.vue] - Error al cerrar sesión: ", error);
    }
}
const toggleLogout = () => {
    openLogout.value = !openLogout.value;
}
</script>

<template>
    <div class="wrap">
        <main v-if="!devices || !createBtn" class="my-tasks">
            <header>
                <h1>Mis tareas</h1>

                <FineBorderButton @click.stop="openMenu = !openMenu">
                    <template #sr-only>
                        Abrir menú
                    </template>

                    <Menu />
                </FineBorderButton>
            </header>

            <div v-if="tasks.length > 0" class="tasks-container" :class="{ 'pb-5' : enableSelectTasks }">
                <header>
                    <div class="task-select">
                        <label for="order-by"><b>Ordenar por:</b></label>
                        <select
                            name="order-by"
                            id="order-by"
                            v-model="order"
                            @change="orderBy"
                        >
                            <option value="mas-reciente">Fecha de creación: Más reciente a más antigua.</option>
                            <option value="mas-antigua">Fecha de creación: Más antigua a más reciente.</option>
                            <option value="a-z">Orden alfabético: De la A - Z.</option>
                            <option value="z-a">Orden alfabético: De la Z - A.</option>
                        </select>
                    </div>

                    <div v-if="tasks.length > 0 && enableSelectTasks == false" class="task-settings task-settings-bg">
                        <FineBorderButton
                            :class="{ 'active-2' : openTaskOptions }"
                            @click.stop="
                                openTaskOptions = !openTaskOptions;
                                editTask = null;
                                confirmDelete = null
                            "
                        >
                            <template #sr-only>
                                {{ openTaskOptions ? 'Cerrar opciones de tareas' : 'Abrir opciones de tareas' }}
                            </template>

                            <MoreVertical v-if="!openTaskOptions"/>
                            <X v-else/>
                        </FineBorderButton>

                        <Transition name="fade-x">
                            <OptionsList
                                v-if="openTaskOptions"
                                v-click-outside="handleCloseTaskOptions"
                            >
                                <Options
                                    @click="enableSelectTasks = true"
                                    @keydown.enter="enableSelectTasks = true"
                                    @keydown.esc="openTaskOptions = false"
                                >
                                    <Trash2 />
                                    <span>Borrar tareas</span>
                                </Options>
                            </OptionsList>
                        </Transition>
                    </div>
                </header>

                <article
                    v-for="task in tasks"
                    :key="task.id"
                    :class="{
                        'task-to' : editTask === task.id || confirmDelete === task.id,
                        'selected-task' : tasksToDelete.includes(task.id),
                        'row' : enableSelectTasks
                    }"
                >
                    <div v-if="editTask !== task.id && confirmDelete !== task.id && !enableSelectTasks" class="task-btn-container py-5">
                        <FineBorderButton @click="openEditTask(task.id); confirmDelete = null">
                            <template #sr-only>
                                Editar
                            </template>

                            <Pencil />
                        </FineBorderButton>

                        <FineBorderButton @click="openConfirmDelete(task.id); editTask = null">
                            <template #sr-only>
                                Eliminar
                            </template>

                            <Trash2 />
                        </FineBorderButton>
                    </div>

                    <div v-if="editTask !== task.id" class="task-details">
                        <TaskInfo infoType="title" :detail="task.title" :font="task.font" :isCompleted="task.completed"/>
                        <TaskInfo infoType="schedule" :scheduled="task.isScheduled" v-if="task.isScheduled"/>
                        <TaskInfo infoType="complete" :isCompleted="task.completed"/>
                        <TaskInfo :created="task.created_at"/>
                    </div>

                    <form
                        v-else-if="editTask === task.id"
                        action=""
                        @submit.prevent="submitEditedTask(task.id, taskDetails.title, taskDetails.isScheduled, taskDetails.font, taskDetails.completed)"
                    >
                        <div class="edit-task-btn-actions">
                            <FineBorderButton
                                :class="{ 'active-2' : scheduleInEdit || taskDetails.isScheduled }"
                                @click="toggleSchedule(task.id)"
                            >
                                <template #sr-only>
                                    {{ !taskDetails.isScheduled ? 'Agregar programación' : 'Cancelar programación' }}
                                </template>

                                <AlarmClockOff v-if="scheduleInEdit !== null || taskDetails.isScheduled !== null"/>
                                <AlarmCheck v-else/>
                            </FineBorderButton>

                            <FineBorderButton
                                :class="{ 'active-2' : fontInEdit }"
                                @click="fontInEdit = !fontInEdit"
                            >
                                <template #sr-only>
                                    Editar fuente de la tarea
                                </template>

                                <TypeIcon/>
                            </FineBorderButton>

                            <FineBorderButton
                                :class="{ 'active-2' : taskDetails.completed }"
                                @click="taskDetails.completed = !taskDetails.completed"
                            >
                                <template #sr-only>
                                    {{ !taskDetails.completed ? "TACHAR TAREA" : "DESTACHAR TAREA" }}
                                </template>

                                <XCircle v-if="taskDetails.completed"/>
                                <CircleCheckIcon v-else/>
                            </FineBorderButton>
                        </div>

                        <StylizedTextarea
                            textType="edit-task"
                            :taskTitle="taskDetails.title"
                            :font="taskDetails.font"
                            @submitForm="submitEditedTask(task.id, taskDetails.title, taskDetails.isScheduled, taskDetails.font, taskDetails.completed)"
                            v-model="taskDetails.title"
                        />

                        <Transition name="fade">
                            <div v-if="scheduleInEdit || taskDetails.isScheduled">
                                <label for="edit-scheduled-task" class="sr-only">
                                    <b>{{ !taskDetails.isScheduled ? "Programar para:" : "Editar programación:" }}</b>
                                </label>

                                <div class="task-to-schedule-container">
                                    <input
                                        type="datetime-local"
                                        name="edit-scheduled-task"
                                        id="edit-scheduled-task"
                                        v-model="taskDetails.isScheduled"
                                    >

                                    <button type="button">
                                        <Calendar1 />
                                    </button>
                                </div>
                            </div>
                        </Transition>

                        <Transition name="fade">
                            <div v-if="fontInEdit" class="task-select-font pt-0">
                                <FineBorderButton
                                    v-for="font in typeOfFont"
                                    :class="[font.class, { 'active-2' : font.class === taskDetails.font }]"
                                    @click="taskDetails.font = font.class"
                                >
                                    <template #sr-only>
                                        Elegir la fuente {{ font.font }}
                                    </template>

                                    {{ font.font }}
                                </FineBorderButton>
                            </div>
                        </Transition>

                        <div class="task-to-btn-containter">
                            <SimpleButton @click="scheduleInEdit = null; fontInEdit = !fontInEdit; editTask = null">
                                Cancelar
                            </SimpleButton>

                            <RoundableButton
                                design="secondary"
                                :disabled="
                                    !taskDetails.title ||
                                    task.title === taskDetails.title &&
                                    task.font === taskDetails.font &&
                                    task.isScheduled === taskDetails.isScheduled &&
                                    task.completed === taskDetails.completed
                                "
                            >
                                <span>Confirmar <span class="created-at-span">cambios</span></span>
                            </RoundableButton>
                        </div>
                    </form>

                    <div v-if="enableSelectTasks == true" class="task-btn-container">
                        <div
                            class="bg-click"
                            @click="!tasksToDelete.includes(task.id) ?
                            tasksToDelete.push(task.id) : tasksToDelete.splice(tasksToDelete.indexOf(task.id), 1)"
                        />

                        <button
                            type="button"
                            v-if="!tasksToDelete.includes(task.id)"
                            class="task-select-btn select-btn"
                            @click="tasksToDelete.push(task.id)"
                            :disabled="tasksToDelete.includes(task.id)"
                        >
                            <span class="sr-only">Seleccionar</span>
                            <Circle />
                        </button>

                        <button
                            type="button"
                            v-else
                            class="task-select-btn deselect-btn"
                            @click="tasksToDelete.splice(tasksToDelete.indexOf(task.id), 1)"
                            :disabled="!tasksToDelete.includes(task.id)"
                        >
                            <span class="sr-only">Deseleccionar</span>
                            <Circle />
                        </button>
                    </div>

                    <div v-if="confirmDelete === task.id" class="task-confirm-container p-top">
                        <p>¿Estás seguro de que querés eliminar esta tarea?</p>

                        <div class="task-btn-container">
                            <SimpleButton @click="confirmDelete = null">Cancelar</SimpleButton>

                            <form
                                action=""
                                @submit.prevent="async () => {
                                    await deleteTaskByID(task.id);
                                    confirmDelete = null;
                                    deletedTaskMessage(task.title);
                                }"
                            >
                                <RoundableButton design="secondary">Confirmar</RoundableButton>
                            </form>
                        </div>
                    </div>
                </article>

                <Transition name="opacity">
                    <section v-if="enableSelectTasks" class="task-delete-container" aria-label="Controles de eliminación de tareas">
                        <p><b>Tareas seleccionadas:</b> {{ tasksToDelete.length }}</p>

                        <div>
                            <SimpleButton @click="enableSelectTasks = false; tasksToDelete.length = 0; openTaskOptions = false">
                                Cancelar
                            </SimpleButton>

                            <form
                                v-if="tasks.length > 0"
                                action=""
                                @submit.prevent="handleDeleteTasks"
                            >
                                <RoundableButton design="main" :disabled="tasksToDelete.length <= 0">
                                    <span>Borrar <span class="created-at-span">tareas seleccionadas</span></span>
                                </RoundableButton>
                            </form>
                        </div>
                    </section>
                </Transition>
            </div>

            <div v-else class="loading-box">
                <Loader v-if="!loadTasks"/>

                <section v-else class="no-tasks">
                    <img src="/Icons/Tareín_duditativo-fondo_transparente.png" alt="Tareito dudando">
                    <p>
                        No creaste ninguna tarea todavía. <br>
                        <span v-if="devices">Podés crear una <strong>presionando el botón de abajo a la derecha</strong>.</span>
                        <span v-else>Podés crear una <strong>completando el campo a tu izquierda</strong>.</span>
                    </p>
                </section>
            </div>

            <Transition name="fade-y">
                <div v-if="notificationMessage" class="alert-message">
                    <div>
                        <p v-html="notificationMessage"/>

                        <FineBorderButton @click="notificationMessage = ''">
                            <template #sr-only>
                                Cerrar mensaje
                            </template>

                            <X />
                        </FineBorderButton>
                    </div>
                </div>
            </Transition>

            <Transition name="fade-y">
                <FineBorderButton
                    v-if="devices && !createBtn && !enableSelectTasks && !editTask && !confirmDelete && !notificationMessage"
                    class="fixed-btn create-btn-style"
                    @click="createBtn = !createBtn"
                >
                    <template #sr-only>
                        Crear tarea
                    </template>

                    <PenTool />
                </FineBorderButton>
            </Transition>
        </main>

        <Transition name="task-create-appear">
            <div class="div-forms" v-if="!devices || createBtn == true">
                <form
                    action=""
                    class="form-class pb-5"
                    @submit.prevent="handleSubmit"
                >
                    <div :class="devices ? 'task-settings' : 'task-setting'">
                        <FineBorderButton v-if="devices" @click="returnBtnForDevices">
                            <template #sr-only>
                                Cerrar y volver atrás
                            </template>

                            <ChevronLeft />
                        </FineBorderButton>

                        <FineBorderButton @click.stop="openTaskSettings = !openTaskSettings" :class="{ 'active' : openTaskSettings }">
                            <template #sr-only>
                                {{ openTaskSettings ? 'Cerrar configuración de tareas' : 'Abrir configuración de tareas' }}
                            </template>

                            <Settings2 v-if="!openTaskSettings"/>
                            <X v-else/>
                        </FineBorderButton>

                        <Transition name="fade-x">
                            <OptionsList
                                v-if="openTaskSettings"
                                v-click-outside="closeTaskOptions"
                            >
                                <Options
                                    @click="toggleAddSchedule"
                                    @keydown.enter="toggleAddSchedule"
                                    @keydown.esc="openTaskSettings = false"
                                >
                                    <AlarmClockIcon />
                                    <span>{{ openScheduleTask ? "Cerrar" : "Programar tarea" }}</span>
                                </Options>

                                <Options
                                    @click="toggleEditFont"
                                    @keydown.enter="toggleEditFont"
                                    @keydown.esc="openTaskSettings = false"
                                >
                                    <TypeIcon />
                                    <span>{{ openFontSelector ? "Cerrar" : "Editar fuente de la tarea" }}</span>
                                </Options>
                            </OptionsList>
                        </Transition>
                    </div>

                    <StylizedTextarea
                        textType="add-task"
                        :taskTitle="newTask.title"
                        :font="newTask.font"
                        @submitForm="handleSubmit"
                        @taskTextarea:task="$emit('taskTextarea:task', $event)"
                        v-model="newTask.title"
                    />

                    <Transition name="fade">
                        <AddOptionForTask v-if="openScheduleTask" option="schedule" labelFor="task-program" @close-option:close="$emit('close-option:close', $event)" v-model="openScheduleTask">
                            <input
                                type="datetime-local"
                                name="task-program"
                                id="task-program"
                                v-model="newTask.isScheduled"
                                class="task-add-schedule-input"
                            >

                            <button type="button" class="task-add-schedule-button">
                                <Calendar1 />
                            </button>
                        </AddOptionForTask>
                    </Transition>

                    <Transition name="fade">
                        <AddOptionForTask v-if="openFontSelector" option="font" @close-option:close="$emit('close-option:close', $event)" v-model="openFontSelector">
                            <FineBorderButton
                                v-for="font in typeOfFont"
                                :class="[font.class, { 'active' : font.class === newTask.font }]"
                                @click="newTask.font = font.class"
                            >
                                <template #sr-only>
                                    Elegir la fuente {{ font.font }}
                                </template>

                                {{ font.font }}
                            </FineBorderButton>
                        </AddOptionForTask>
                    </Transition>

                    <RoundableButton :disabled="!newTask.title || loading == true" :class="{ 'fixed-btn' : devices }">
                        {{ loading ? "Creando..." : "Crear tarea" }}
                    </RoundableButton>
                </form>

            </div>
        </Transition>

        <div v-if="openMenu && !openLogout" class="aside-bg"/>

        <Transition name="slide">
            <aside v-if="openMenu && !openLogout" v-click-outside="toggleMenu">
                <div>
                    <span>¡Bienvenido, <strong>{{ loggedUser.displayName }}</strong>!</span>

                    <FineBorderButton @click="openMenu = !openMenu">
                        <template #sr-only>
                            Cerrar menú
                        </template>

                        <X />
                    </FineBorderButton>
                </div>

                <div>
                    <FineBorderButton @click.stop="openLogout = !openLogout" class="logout-btn">
                        <template #sr-only>
                            Cerrar sesión
                        </template>

                        <LogOut />
                        <span>Cerrar sesión</span>
                    </FineBorderButton>
                </div>
            </aside>
        </Transition>

        <div v-if="openLogout" class="logout-bg"/>

        <Transition name="fade-y">
            <div v-if="openLogout" v-click-outside="toggleLogout" class="logout-confirmation">
                <p>¿Estás seguro de que querés cerrar sesión?</p>

                <div class="logout-btn-container">
                    <SimpleButton @click="toggleLogout">Cancelar</SimpleButton>

                    <RoundableButton design="secondary" @click="handleLogout">Confirmar</RoundableButton>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    directives: {
        clickOutside
    }
}
</script>