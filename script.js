// Seleccionar elementos del DOM
const generateBtn = document.getElementById("generateBtn");
const paletteSize = document.getElementById("paletteSize");

// Función para generar un color HSL aleatorio
function generarColorHSL() {
    
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Función para generar un color HEX aleatorio
function generarColorHEX() {

    const letras = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }

    return color;
}

// Evento click del botón
generateBtn.addEventListener("click", function () {

    // Obtener el valor del select
    const cantidad = paletteSize.value;

    const colorHSL = generarColorHSL();
    const colorHEX = generarColorHEX();

    // Mostrar en consola
    console.log("Cantidad seleccionada:", cantidad);
    console.log("Color HSL:", colorHSL);
    console.log("Color HEX:", colorHEX);
});