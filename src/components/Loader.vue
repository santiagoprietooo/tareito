<template>
    <div>
        <span class="sr-only">Cargando...</span>
        <div class="loader" />
    </div>
</template>

<style scoped>
.loader {
    width: 65px;
    height: 30px;
    position: relative;
}
.loader:before {
    content: "";
    position: absolute;
    border-radius: 50px;
    box-shadow: 0 0 0 3px inset black;
    animation: l3 0.75s infinite alternate;
}
</style>