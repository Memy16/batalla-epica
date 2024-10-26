document.addEventListener("DOMContentLoaded", function() {
    const lienzo = document.getElementById("lienzo");
    const contexto = lienzo.getContext("2d");

    let tamañoCuadrado = 80;
    const filas = 8;
    const columnas = 8;

    const imagenes = {
        azul: new Image(),
        rojo: new Image()
    };
    const sonidoExplosion = document.getElementById("sonidoExplosion");

    imagenes.azul.src = 'https://i.ibb.co/ng9x6F8/soldadito.png';
    imagenes.rojo.src = 'https://i.ibb.co/4PVrDwb/soldadito-de-plomo.png';

    const piezasIniciales = [
        ["rojo", "rojo", "rojo", "rojo", "rojo", "rojo", "rojo", "rojo"],
        ["rojo", "rojo", "rojo", "rojo", "rojo", "rojo", "rojo", "rojo"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["azul", "azul", "azul", "azul", "azul", "azul", "azul", "azul"],
        ["azul", "azul", "azul", "azul", "azul", "azul", "azul", "azul"]
    ];

    let piezaSeleccionada = null;
    let piezaSeleccionadaPos = null;
    let puntajeAzul = 0;
    let puntajeRojo = 0;
    let turno = 'azul';

    function ajustarTamañoLienzo() {
        let anchoPantalla = Math.min(window.innerWidth, 600); 
        lienzo.width = anchoPantalla;
        lienzo.height = anchoPantalla;
        tamañoCuadrado = anchoPantalla / columnas; 
        dibujarTablero();
    }

    function dibujarTablero() {
        for (let fila = 0; fila < filas; fila++) {
            for (let col = 0; col < columnas; col++) {
                contexto.fillStyle = (fila + col) % 2 === 0 ? "#f0d9b5" : "#b58863";
                contexto.fillRect(col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
                const pieza = piezasIniciales[fila][col];
                if (pieza) {
                    const imagen = pieza === "azul" ? imagenes.azul : imagenes.rojo;
                    contexto.drawImage(imagen, col * tamañoCuadrado, fila * tamañoCuadrado, tamañoCuadrado, tamañoCuadrado);
                }
            }
        }
        document.getElementById("mensaje").innerText = `Puntos - Azul: ${puntajeAzul} | Rojo: ${puntajeRojo}`;
    }

    function mostrarExplosion(fila, col) {
        const rect = lienzo.getBoundingClientRect();
        const x = rect.left + col * tamañoCuadrado;
        const y = rect.top + fila * tamañoCuadrado;
        imagenCoalicion.style.left = `${x}px`;
        imagenCoalicion.style.top = `${y}px`;
        imagenCoalicion.style.display = "block";

        sonidoExplosion.currentTime = 0;
        sonidoExplosion.play();

        setTimeout(() => {
            imagenCoalicion.style.display = "none";
        }, 2000);
    }

    window.addEventListener('resize', ajustarTamañoLienzo); 
    ajustarTamañoLienzo();

    lienzo.addEventListener("click", (event) => {
        const rect = lienzo.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / tamañoCuadrado);
        const fila = Math.floor(y / tamañoCuadrado);

        const piezaEnCelda = piezasIniciales[fila][col];

        if (piezaSeleccionada) {
            if (turno === 'azul' && piezaSeleccionada === "azul" && !piezaEnCelda) {
                piezasIniciales[fila][col] = piezaSeleccionada;
                piezasIniciales[piezaSeleccionadaPos.fila][piezaSeleccionadaPos.col] = ""; 
                turno = 'rojo';
                piezaSeleccionada = null;
                dibujarTablero();
            } else if (turno === 'azul' && piezaSeleccionada === "azul" && piezaEnCelda === "rojo") {
                puntajeAzul++;
                piezasIniciales[fila][col] = piezaSeleccionada;
                piezasIniciales[piezaSeleccionadaPos.fila][piezaSeleccionadaPos.col] = "";
                mostrarExplosion(fila, col);
                turno = 'rojo';
                piezaSeleccionada = null;
                dibujarTablero();
            } else if (turno === 'rojo' && piezaSeleccionada === "rojo" && !piezaEnCelda) {
                piezasIniciales[fila][col] = piezaSeleccionada;
                piezasIniciales[piezaSeleccionadaPos.fila][piezaSeleccionadaPos.col] = ""; 
                turno = 'azul';
                piezaSeleccionada = null;
                dibujarTablero();
            } else if (turno === 'rojo' && piezaSeleccionada === "rojo" && piezaEnCelda === "azul") {
                puntajeRojo++;
                piezasIniciales[fila][col] = piezaSeleccionada;
                piezasIniciales[piezaSeleccionadaPos.fila][piezaSeleccionadaPos.col] = "";
                mostrarExplosion(fila, col);
                turno = 'azul';
                piezaSeleccionada = null;
                dibujarTablero();
            }
        } else if (piezaEnCelda && ((turno === 'azul' && piezaEnCelda === "azul") || (turno === 'rojo' && piezaEnCelda === "rojo"))) {
            piezaSeleccionada = piezaEnCelda;
            piezaSeleccionadaPos = { fila, col };
        }
    });

    imagenes.azul.onload = dibujarTablero;
    imagenes.rojo.onload = dibujarTablero;
});
