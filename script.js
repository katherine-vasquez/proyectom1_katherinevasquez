// =======================
// ELEMENTOS DEL DOM
// =======================
const generateBtn = document.getElementById("generateBtn");
const paletteSize = document.getElementById("paletteSize");
const paletteContainer = document.getElementById("paletteContainer");
const toast = document.getElementById("toast");
const colorFormat = document.getElementById("colorFormat");
const copyPaletteBtn = document.getElementById("copyPaletteBtn");

colorFormat.value = localStorage.getItem("format") || "hex";

let currentPalette = [];

// =======================
// GENERAR COLOR HSL
// =======================
function generarColorHSL() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 100);

    return `hsl(${h}, ${s}%, ${l}%)`;
}

// =======================
// HSL → HEX
// =======================
function hslToHex(hsl) {
    const result = hsl.match(/\d+/g);
    let h = result[0] / 360;
    let s = result[1] / 100;
    let l = result[2] / 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// =======================
// CREAR BLOQUE DE COLOR
// =======================
function crearColorDiv(colorObj, formato) {

    const color = formato === "hsl" ? colorObj.hsl : colorObj.hex;

    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = colorObj.hex;

    const lockBtn = document.createElement("button");
    lockBtn.textContent = colorObj.locked ? "🔒" : "🔓";
    lockBtn.classList.add("lock-btn");

    lockBtn.addEventListener("click", function (e) {
    e.stopPropagation();

    colorObj.locked = !colorObj.locked;
    lockBtn.textContent = colorObj.locked ? "🔒" : "🔓";
});


    const label = document.createElement("span");
    label.classList.add("color-label");

    // guardamos datos base
    label.dataset.hex = colorObj.hex;
    label.dataset.hsl = colorObj.hsl;

    label.textContent = color;

    colorDiv.appendChild(label);

    colorDiv.appendChild(lockBtn);

    colorDiv.addEventListener("click", function () {
        navigator.clipboard.writeText(color);
        mostrarToast("Copiado: " + color);
    });

    return colorDiv;
}

// =======================
// TOAST
// =======================
function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 1500);
}

// =======================
// GENERAR PALETA
// =======================
generateBtn.addEventListener("click", function () {

    console.log("🟢 Botón generar presionado");

    const cantidad = paletteSize.value;
    const formato = colorFormat.value;

    const nuevaPaleta = [];

for (let i = 0; i < cantidad; i++) {

    // 🔒 si existe y está bloqueado → se conserva
    if (currentPalette[i] && currentPalette[i].locked) {
        nuevaPaleta[i] = currentPalette[i];
        continue;
    }

    const hsl = generarColorHSL();
    const hex = hslToHex(hsl);

   nuevaPaleta[i] = nuevaPaleta[i] || {
    hex: hex,
    hsl: hsl,
    locked: false
    };
}

 console.log("🎨 Nueva paleta:", nuevaPaleta);

currentPalette = nuevaPaleta;

    renderPalette(formato);
    guardarEnHistorial();
    guardarPaleta();
});

// =======================
// RENDER PALETA
// =======================
function renderPalette(formato) {

    paletteContainer.innerHTML = "";

    currentPalette.forEach(colorObj => {
        const colorDiv = crearColorDiv(colorObj, formato);
        paletteContainer.appendChild(colorDiv);
    });
}

// =======================
// COPIAR PALETA COMPLETA
// =======================
copyPaletteBtn.addEventListener("click", () => {

    if (!currentPalette.length) {
        mostrarToast("No hay paleta para copiar");
        return;
    }

    const formato = colorFormat.value;

    const colores = currentPalette.map(colorObj => {
        return formato === "hsl" ? colorObj.hsl : colorObj.hex;
    });

    const texto = colores.join(", ");

    navigator.clipboard.writeText(texto);

    mostrarToast("Paleta copiada 🎨");
});

// 🔥 FUNCIÓN PARA APLICAR PALETA DESDE HISTORIAL
function applyPalette(colors) {
    const boxes = document.querySelectorAll("#paletteContainer div");

    colors.forEach((color, i) => {
        if (boxes[i]) {
            boxes[i].style.backgroundColor = color;
        }
    });
}

function renderHistory() {
    const historyContainer = document.getElementById("historyContainer");

let history = JSON.parse(localStorage.getItem("paletteHistory")) || [];

// 🧠 LIMPIEZA DE PALLETAS ROTAS
    history = history.filter(p =>
        p && p.colors && p.colors.length
    );

    historyContainer.innerHTML = "";

    // 🔥 MENSAJE SI NO HAY HISTORIAL
if (history.length === 0) {
    historyContainer.innerHTML = `
        <div class="empty-history">
            🎨 Aún no hay paletas generadas
        </div>
    `;
    return;
}

    history.forEach((palette, index) => {

        const card = document.createElement("div");
        card.classList.add("history-card");

        // botón favorito
        
        const favBtn = document.createElement("button");
        favBtn.classList.add("fav-btn");
        favBtn.innerText = palette.favorite ? "⭐" : "☆";

        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const history = JSON.parse(localStorage.getItem("paletteHistory")) || [];

            history[index].favorite = !history[index].favorite;

            localStorage.setItem("paletteHistory", JSON.stringify(history));

            renderHistory();
        });

        // botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerText = "🗑️";

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            const history = JSON.parse(localStorage.getItem("paletteHistory")) || [];

            history.splice(index, 1);

            localStorage.setItem("paletteHistory", JSON.stringify(history));

            renderHistory();
        });

        // 🎯 botón usar paleta (aplicar al generador)
            const useBtn = document.createElement("button");
            useBtn.classList.add("use-btn");
            useBtn.innerText = "Usar";

            useBtn.addEventListener("click", (e) => {
                 e.stopPropagation();

                 const colors = palette.colors.map(c => c.hex);

                applyPalette(colors);
         });




        // colores de la paleta
        (palette.colors || []).forEach(color => {
            const colorDiv = document.createElement("div");
            colorDiv.classList.add("history-color");
            colorDiv.style.backgroundColor = color.hex;
            card.appendChild(colorDiv);
        });

        // botón usar
        const btn = document.createElement("button");
        btn.classList.add("history-btn");
        btn.innerText = "Usar";

        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            currentPalette = JSON.parse(JSON.stringify(palette.colors));
            renderPalette(colorFormat.value);
        });


        // agregar elementos a la card

        card.appendChild(useBtn);
        card.appendChild(btn);
        card.appendChild(favBtn);
        card.appendChild(deleteBtn);

        card.addEventListener("click", () => {
            currentPalette = JSON.parse(JSON.stringify(palette.colors));
            renderPalette(colorFormat.value);
        });

        historyContainer.appendChild(card);
    });
}

// =======================
// CAMBIO DE FORMATO
// =======================
colorFormat.addEventListener("change", function () {
    renderPalette(colorFormat.value);
    localStorage.setItem("format", colorFormat.value);
});

// =======================
// LOCALSTORAGE
// =======================

function guardarEnHistorial() {

    let history = JSON.parse(localStorage.getItem("paletteHistory")) || [];

    const nuevaPaleta = {
        colors: JSON.parse(JSON.stringify(currentPalette)),
        favorite: false
    };

    history.unshift(nuevaPaleta);

    // 🔥 LIMITE DE 8
    history = history.slice(0, 8);

    localStorage.setItem("paletteHistory", JSON.stringify(history));

    renderHistory();
}

function cargarPaleta() {
    const data = localStorage.getItem("palette");

    if (data) {
        currentPalette = JSON.parse(data);
        renderPalette(colorFormat.value);
    } else {
        currentPalette = [];
    }
}

function saveHistory(history) {
    localStorage.setItem("paletteHistory", JSON.stringify(history));
}

// ejecutar al iniciar la app
cargarPaleta();

renderHistory();

function guardarPaleta() {
    localStorage.setItem("palette", JSON.stringify(currentPalette));
}