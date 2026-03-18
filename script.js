// Seleccionar elementos del DOM
const generateBtn = document.getElementById("generateBtn");
const paletteSize = document.getElementById("paletteSize");

// Evento click del botón
generateBtn.addEventListener("click", function () {

    // Obtener el valor del select
    const cantidad = paletteSize.value;

    // Mostrar en consola
    console.log("Cantidad seleccionada:", cantidad);

});