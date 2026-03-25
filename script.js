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

// Evento click del botón
generateBtn.addEventListener("click", function () {

    // Obtener el valor del select
    const cantidad = paletteSize.value;

    const color = generarColorHSL();

    // Mostrar en consola
    console.log("Cantidad seleccionada:", cantidad);
     console.log("Color generado:", color);

});
