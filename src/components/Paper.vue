<template>
    <div class="paper">
        <div class="paper-row">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </div>

        <ul>
            <slot/>
        </ul>

        <span class="paper-col-red-line" aria-hidden="true"></span>
        <span class="paper-col-red-line" aria-hidden="true"></span>
    </div>
</template>

<style scoped>
.paper {
    position: relative;
    display: flex;
    flex-direction: row;
    background-color: white;
    padding: 2.5rem 0;
}

.paper-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 0.110rem solid red;
}
.paper-row span {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 2.5rem;
    width: 2.5rem;
    border-bottom: 1.5px solid rgba(0, 0, 0, 0.275);
}
.paper-row span:first-of-type {
    border-top: 1.5px solid rgba(0, 0, 0, 0.275);
}

.paper ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.paper-col-red-line {
    position: absolute;
    top: 0;
    left: 2.5rem;
    display: block;
    height: 2.5rem;
    width: 0.110rem;
    background-color: red;
}
.paper-col-red-line:last-of-type {
    top: unset;
    bottom: 0;
}
</style>