// Seleccionar elementos del DOM
const generateBtn = document.getElementById("generateBtn");
const paletteSize = document.getElementById("paletteSize");
const paletteContainer = document.getElementById("paletteContainer");
const toast = document.getElementById("toast");

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

// Función para mostrar un mensaje de toast
function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 1500);
}

// Evento click del botón
generateBtn.addEventListener("click", function () {

    // Obtener el valor del select
    const cantidad = paletteSize.value;

    paletteContainer.innerHTML = "";

    console.log("Cantidad seleccionada:", cantidad);

    for (let i = 0; i < cantidad; i++) {
        
    const colorHSL = generarColorHSL();
    const colorHEX = generarColorHEX();

    console.log("Color HSL:", colorHSL);
    console.log("Color HEX:", colorHEX);

    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = colorHEX;
    colorDiv.textContent = colorHEX;

    colorDiv.addEventListener("click", function () {
    navigator.clipboard.writeText(colorHEX);
    mostrarToast("Copiado: " + colorHEX);
});

    paletteContainer.appendChild(colorDiv);



  
    }
});