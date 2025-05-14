/**
 * Obtiene un objeto de tipo Date o una cadena de fecha y lo devuelve con el formato DD/Month/YYYY.
 * @param {Date|string|null} date 
 * @returns {string|null}
 */
export function getDate(date) {
    if (!date) return null;

    const validDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(validDate)) {
        return null;
    }

    const formatter = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return formatter.format(validDate);
}


/**
 * Obtiene un objeto de tipo Date y lo devuelve con el formato de 24hs con hora Argentina.
 * @param {Date|string|null} hour 
 * @returns {string}
 */
export function getHour(hour) {
    if(!hour) return null;

    const validDate = typeof hour === "string" ? new Date(hour) : hour;

    if (isNaN(validDate)) {
        return null;
    }

    const formatter = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });

    return formatter.format(validDate);
}