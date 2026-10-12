
let sentimientoSeleccionado = null;
let intervaloConsejos = null;

// Tips rotativos
const consejosParaDormir = [
    ['☁️', 'Evita pantallas 1 hora antes'],
    ['☁️', 'Mantén tu habitación fresca'],
    ['☁️', 'Crea una rutina de sueño'],
    ['🌙', 'Usa cortinas oscuras'],
    ['🛏️', 'Mantén horarios regulares'],
    ['📱', 'Modo nocturno en dispositivos'],
    ['🧘', 'Practica meditación'],
    ['🎵', 'Escucha música relajante'],
    ['📖', 'Lee un libro antes de dormir'],
    ['🌡️', 'Temperatura ideal: 18-20°C']
];

let indiceConsejoActual = 0;

function rotarConsejos() {
    const contenedorConsejos = document.querySelector('.consejos-dormir');
    if (!contenedorConsejos) return;

    const elementos = contenedorConsejos.querySelectorAll('.elemento-consejo');

    elementos.forEach((elemento, index) => {
        // Calculara cual consejo se mostrara
        const indiceConsejo = (indiceConsejoActual + index) % consejosParaDormir.length;
        const [emoji, texto] = consejosParaDormir[indiceConsejo];
        elemento.innerHTML = `<span>${emoji}</span><span>${texto}</span>`;
    });

    indiceConsejoActual = (indiceConsejoActual + 3) % consejosParaDormir.length;
}

// Iniciar rotación de consejos cada 5 segundos
intervaloConsejos = setInterval(rotarConsejos, 5000);

// Botones de sentimiento
document.querySelectorAll('.boton-sentimiento').forEach(boton => {
    boton.addEventListener('click', function () {
        document.querySelectorAll('.boton-sentimiento').forEach(b => b.classList.remove('activo'));
        this.classList.add('activo');
        sentimientoSeleccionado = this.dataset.valor;
    });
});

// Variable global para el gráfico
let miGrafico = null;
let datosSaludGlobales = {
    horasSueno: 0,
    energia: 0,
    cafeina: 0,
    descanso: 0
};

function calcular() {
    const edad = document.getElementById('edad').value;
    const bebidas = document.getElementById('bebidas').value;
    const estado = document.getElementById('estado').value;
    const horaDespertar = document.getElementById('horaDespertar').value;
    const horaDormir = document.getElementById('horaDormir').value;

    if (!edad || !sentimientoSeleccionado) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Calcular horas de sueño
    const [horaD, minD] = horaDormir.split(':').map(Number);
    const [horaDesp, minDesp] = horaDespertar.split(':').map(Number);
    let horasSueno = (horaDesp * 60 + minDesp) - (horaD * 60 + minD);
    if (horasSueno < 0) 
    horasSueno += 24 * 60;
    horasSueno = horasSueno / 60;

    // Cafeína recomendada
    let mensajeCafeina = bebidas > 2 ?
        '⚠️ Reduce tu consumo de cafeína' :
        '✅ Tu consumo es moderado';

    document.getElementById('resultadoCafeina').textContent = mensajeCafeina;

    // Porcentaje de energía
    let energia = Math.max(0, Math.min(100, (horasSueno / 8) * 100 - (bebidas * 10)));
    document.getElementById('resultadoEnergia').textContent = `${Math.round(energia)}%`;

    // Calcular tiempo de eliminación de cafeína
    const mgCafeina = bebidas * 80;
    const horasEliminacion = bebidas > 0 ? bebidas * 5 : 0;

    let mensajeTiempo = '';
    if (bebidas == 0) {
        mensajeTiempo = '✅ Sin cafeína en el sistema';
    } else if (bebidas == 1) {
        mensajeTiempo = `⏱️ ${horasEliminacion}h para eliminar ${mgCafeina}mg de cafeína (1 bebida)`;
    } else {
        mensajeTiempo = `⏱️ ${horasEliminacion}h para eliminar ${mgCafeina}mg de cafeína (${bebidas} bebidas)`;
    }

    document.getElementById('resultadoTiempoCafeina').textContent = mensajeTiempo;

    // Actualiza la variable datosSaludGlobales
    datosSaludGlobales = {
        horasSueno: horasSueno,
        energia: Math.round(energia),
        cafeina: parseInt(bebidas),
        descanso: sentimientoSeleccionado === 'bien' ? 70 : 40
    };

    // Actualiza el gráfico
    crearGrafico();

    console.log('Datos actualizados:', datosSaludGlobales);

    // Alimentos recomendados
    const alimentosBase = {
        altaCafeina: [
            '🥛 Leche tibia con miel (reduce ansiedad)',
            '🍌 Plátanos (potasio para relajar músculos)',
            '🥜 Nueces (magnesio contra el estrés)',
            '🍵 Té de valeriana (efecto calmante potente)',
            '🥗 Espinacas (magnesio y triptófano)',
            '🍒 Cerezas (melatonina natural)'
        ],
        moderadaCafeina: [
            '🍵 Té de manzanilla (relajante suave)',
            '🍌 Plátanos (triptófano)',
            '🥛 Leche tibia (calcio y triptófano)',
            '🍯 Miel (regula azúcar en sangre)',
            '🥜 Almendras (magnesio)',
            '🫐 Arándanos (antioxidantes)'
        ],
        pocoSueno: [
            '🥚 Huevos (proteína de calidad)',
            '🐟 Salmón (omega-3 y vitamina D)',
            '🥑 Aguacate (grasas saludables)',
            '🍠 Camote (carbohidratos complejos)',
            '🥗 Espinacas (hierro y magnesio)',
            '🍗 Pechuga de pollo (triptófano)'
        ],
        bienBalanceado: [
            '🥛 Yogurt natural (probióticos)',
            '🍌 Plátanos (energía gradual)',
            '🥜 Frutos secos variados',
            '🍵 Té verde (antioxidantes)',
            '🍯 Miel natural',
            '🥗 Ensalada verde'
        ]
    };

    let alimentosRecomendados = [];

    if (bebidas >= 3) {
        alimentosRecomendados = alimentosBase.altaCafeina;
    } else if (bebidas >= 1 && horasSueno < 6) {
        alimentosRecomendados = [
            ...alimentosBase.moderadaCafeina.slice(0, 3),
            ...alimentosBase.pocoSueno.slice(0, 3)
        ];
    } else if (horasSueno < 6) {
        alimentosRecomendados = alimentosBase.pocoSueno;
    } else if (bebidas >= 1) {
        alimentosRecomendados = alimentosBase.moderadaCafeina;
    } else {
        alimentosRecomendados = alimentosBase.bienBalanceado;
    }

    let tituloAlimentos = '';
    if (bebidas >= 3) {
        tituloAlimentos = '⚠️ Alimentos para contrarrestar exceso de cafeína:';
    } else if (horasSueno < 6) {
        tituloAlimentos = '😴 Alimentos para recuperar energía:';
    } else if (bebidas >= 1) {
        tituloAlimentos = '🍃 Alimentos para mejor descanso:';
    } else {
        tituloAlimentos = '✅ Alimentos para mantener el balance:';
    }

    document.getElementById('listaAlimentos').innerHTML =
        `<div style="color: #ffd700; font-weight: bold; margin-bottom: 15px; text-align: center;">${tituloAlimentos}</div>` +
        alimentosRecomendados.map(a => `<div style="padding: 8px; text-align: left; border-left: 3px solid rgba(102, 126, 234, 0.5); margin: 5px 0; padding-left: 15px;">${a}</div>`).join('');
}

function vaciarCampos() {
    // Limpiar campos de la calculadora
    document.getElementById('edad').value = '';
    document.getElementById('horaDespertar').value = '07:00';
    document.getElementById('horaDormir').value = '23:00';
    document.getElementById('bebidas').value = '0';
    document.getElementById('estado').value = 'feliz';

    document.querySelectorAll('.boton-sentimiento').forEach(b => b.classList.remove('activo'));
    sentimientoSeleccionado = null;

    document.getElementById('resultadoCafeina').textContent = 'Ingresa tus datos y calcula';
    document.getElementById('resultadoEnergia').textContent = 'Ingresa tus datos y calcula';
    document.getElementById('resultadoTiempoCafeina').textContent = 'Ingresa tus datos y calcula';
    document.getElementById('listaAlimentos').innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Presiona calcular para ver recomendaciones</div>';

    // Limpiar campos del foro
    const preguntaUsuario = document.getElementById('preguntaUsuario');
    if (preguntaUsuario) {
        preguntaUsuario.value = '';
    }

    // Ocultar la sección de respuesta
    const seccionRespuesta = document.getElementById('seccionRespuesta');
    if (seccionRespuesta) {
        seccionRespuesta.style.display = 'none';
    }

    // Reiniciar datos de salud globales
    datosSaludGlobales = {
        horasSueno: 0,
        energia: 0,
        cafeina: 0,
        descanso: 0
    };

    // Reiniciar el gráfico con datos en cero
    if (miGrafico) {
        miGrafico.destroy();
    }
    crearGrafico();

    alert('✅ Todos los campos y datos han sido limpiados correctamente');
}
// Gráfico
function crearGrafico() {
    const ctx = document.getElementById('graficoSalud');
    if (!ctx) return;

    const contexto = ctx.getContext('2d');

    if (miGrafico) {
        miGrafico.destroy();
    }

    const puntuacionSueno = Math.min((datosSaludGlobales.horasSueno / 8) * 100, 100);
    const puntuacionCafeina = Math.min(datosSaludGlobales.cafeina * 25, 100);

    miGrafico = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: ['Sueño', 'Energía', 'Cafeína', 'Descanso'],
            datasets: [{
                label: 'Nivel de Salud (%)',
                data: [
                    puntuacionSueno,
                    datosSaludGlobales.energia,
                    puntuacionCafeina,
                    datosSaludGlobales.descanso
                ],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}
// Foro
function generarRespuestaIA(pregunta) {
    const preguntaMinuscula = pregunta.toLowerCase();

    let respuesta = '';
    let alerta = '';

    const puntuacionSueno = (datosSaludGlobales.horasSueno / 8) * 100;
    const problemaSueno = datosSaludGlobales.horasSueno < 6;
    const problemaCafeina = datosSaludGlobales.cafeina >= 3;
    const problemaEnergia = datosSaludGlobales.energia < 50;

    respuesta += `<div class="resumen-estadisticas">
        <strong>📊 Análisis de tus datos:</strong><br>
        • Horas de sueño: ${datosSaludGlobales.horasSueno.toFixed(1)}h (${puntuacionSueno.toFixed(0)}%)<br>
        • Nivel de energía: ${datosSaludGlobales.energia}%<br>
        • Consumo de cafeína: ${datosSaludGlobales.cafeina} bebidas<br>
        • Calidad de descanso: ${datosSaludGlobales.descanso}%
    </div>`;

    if (preguntaMinuscula.includes('cansado') || preguntaMinuscula.includes('cansancio') || preguntaMinuscula.includes('fatiga')) {
        respuesta += `<p>Entiendo tu preocupación sobre el cansancio. Según tus datos:</p>`;

        if (problemaSueno) {
            alerta = `<div class="alerta">⚠️ <strong>Alerta:</strong> Estás durmiendo solo ${datosSaludGlobales.horasSueno.toFixed(1)} horas. Se recomienda 7-9 horas para adultos.</div>`;
            respuesta += `<p>Tu principal problema es la <strong>falta de sueño</strong>. Con ${datosSaludGlobales.horasSueno.toFixed(1)} horas, tu cuerpo no se recupera adecuadamente.</p>`;
        }

        if (problemaCafeina) {
            respuesta += `<p>El consumo de ${datosSaludGlobales.cafeina} bebidas energéticas está afectando tu ciclo de sueño y creando un círculo vicioso de fatiga.</p>`;
        }

        respuesta += `<p><strong>Recomendaciones:</strong></p>
        <ul>
            <li>Intenta acostarte 30 minutos más temprano cada noche</li>
            <li>Reduce gradualmente el consumo de cafeína</li>
            <li>Establece una rutina de sueño consistente</li>
        </ul>`;
    }
    else if (preguntaMinuscula.includes('dormir') || preguntaMinuscula.includes('sueño') || preguntaMinuscula.includes('insomnio')) {
        respuesta += `<p>Sobre tu problema de sueño, veo que actualmente duermes ${datosSaludGlobales.horasSueno.toFixed(1)} horas.</p>`;

        if (problemaCafeina) {
            alerta = `<div class="alerta">⚠️ <strong>Importante:</strong> Tu consumo de ${datosSaludGlobales.cafeina} bebidas energéticas está interfiriendo con tu sueño.</div>`;
            respuesta += `<p>La cafeína puede permanecer en tu sistema hasta ${datosSaludGlobales.cafeina * 5} horas. Esto está afectando tu capacidad para dormir.</p>`;
        }

        respuesta += `<p><strong>Tips para mejorar tu sueño:</strong></p>
        <ul>
            <li>No consumas cafeína después de las 2 PM</li>
            <li>Evita pantallas 1 hora antes de dormir</li>
            <li>Mantén tu habitación fresca (18-20°C)</li>
            <li>Practica técnicas de relajación</li>
        </ul>`;
    }
    else if (preguntaMinuscula.includes('energía') || preguntaMinuscula.includes('energia') || preguntaMinuscula.includes('concentra')) {
        respuesta += `<p>Tu nivel de energía actual es del ${datosSaludGlobales.energia}%.</p>`;

        if (problemaEnergia) {
            alerta = `<div class="alerta">⚠️ Tu energía está baja. Esto puede deberse a múltiples factores.</div>`;
        }

        respuesta += `<p><strong>Para mejorar tu energía:</strong></p>
        <ul>
            <li>Prioriza dormir ${8 - datosSaludGlobales.horasSueno > 0 ? (8 - datosSaludGlobales.horasSueno).toFixed(1) : '0'} hora(s) más</li>
            <li>Come alimentos ricos en hierro y vitaminas B</li>
            <li>Hidrátate bien (2-3 litros de agua al día)</li>
            <li>Haz ejercicio moderado 30 min al día</li>
        </ul>`;
    }
    else if (preguntaMinuscula.includes('cafeína') || preguntaMinuscula.includes('cafeina') || preguntaMinuscula.includes('café') || preguntaMinuscula.includes('energética')) {
        respuesta += `<p>Actualmente consumes ${datosSaludGlobales.cafeina} bebidas energéticas, equivalente a ${datosSaludGlobales.cafeina * 80}mg de cafeína.</p>`;

        if (problemaCafeina) {
            alerta = `<div class="alerta">⚠️ <strong>Alto consumo:</strong> El límite recomendado es 400mg/día (5 bebidas). Estás cerca o por encima.</div>`;
            respuesta += `<p>Este nivel de consumo puede causar:</p>
            <ul>
                <li>Dificultad para dormir</li>
                <li>Ansiedad y nerviosismo</li>
                <li>Dependencia de la cafeína</li>
                <li>Problemas digestivos</li>
            </ul>`;
        }

        respuesta += `<p><strong>Plan de reducción gradual:</strong></p>
        <ul>
            <li>Semana 1: Reduce 1 bebida</li>
            <li>Semana 2: Reduce otra bebida</li>
            <li>Reemplaza con agua, té verde o infusiones</li>
        </ul>`;
    }
    else {
        respuesta += `<p>Gracias por tu consulta. Basándome en tus estadísticas de salud:</p>`;

        if (problemaSueno) {
            alerta = `<div class="alerta">⚠️ Tu sueño necesita atención prioritaria.</div>`;
            respuesta += `<p>• <strong>Sueño:</strong> Necesitas mejorar tus horas de descanso (${datosSaludGlobales.horasSueno.toFixed(1)}h actualmente)</p>`;
        }
        if (problemaCafeina) {
            respuesta += `<p>• <strong>Cafeína:</strong> Tu consumo es elevado (${datosSaludGlobales.cafeina} bebidas)</p>`;
        }
        if (problemaEnergia) {
            respuesta += `<p>• <strong>Energía:</strong> Está por debajo del nivel óptimo (${datosSaludGlobales.energia}%)</p>`;
        }

        respuesta += `<p><strong>Recomendación general:</strong> Prioriza mejorar tu higiene del sueño y reducir gradualmente la cafeína. Si los síntomas persisten, considera consultar con un profesional de salud.</p>`;
    }

    return alerta + respuesta;
}

function enviarConsulta() {
    const pregunta = document.getElementById('preguntaUsuario').value.trim();

    if (!pregunta) {
        alert('Por favor escribe una pregunta');
        return;
    }

    const seccionRespuesta = document.getElementById('seccionRespuesta');
    const contenidoRespuesta = document.getElementById('contenidoRespuesta');

    contenidoRespuesta.innerHTML = '<p style="text-align: center;">⏳ Analizando tu consulta y estadísticas...</p>';
    seccionRespuesta.style.display = 'block';

    // Definir respuesta en espera
    setTimeout(() => {
        const respuesta = generarRespuestaIA(pregunta);
        contenidoRespuesta.innerHTML = respuesta;
        seccionRespuesta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
}

function enviarEstadisticas() {
    alert('📊 Estadísticas enviadas al personal de enfermería\n\n' +
        'Tus datos de salud han sido compartidos exitosamente.\n' +
        'Recibirás una respuesta personalizada pronto.');
}

// Cargar gráfico cuando la página termine de cargar para evitar que se cree el grafico 
// antes del canvas.
window.addEventListener('load', () => {
    crearGrafico();
});

// *Animacion multimedia de sonido**

// Motor de audio del navegador
let audioContextReproductor;
// Controlara el volumeen
let gainNodeReproductor;
// Generara sonidos como tonos suaves
let oscillatorReproductor;
// Si hay algun sonido reproduciendose
let isPlayingReproductor = false;
let sonidoActualReproductor = null;
// Almacenara el sonido de "ruido blanco" preparado.
let noiseBufferReproductor;

function inicializarAudioReproductor() {
    if (!audioContextReproductor) {
        audioContextReproductor = new (window.AudioContext || window.webkitAudioContext)();
        // Configura el control del volumen y crea un nodo de volumen
        gainNodeReproductor = audioContextReproductor.createGain();
        // Conecta a los parlantes
        gainNodeReproductor.connect(audioContextReproductor.destination);
        // Volumen ajustado del 50%
        gainNodeReproductor.gain.value = 0.5;

        // Crea buffer de ruido blanco
        noiseBufferReproductor = audioContextReproductor.createBuffer(1, audioContextReproductor.sampleRate * 2, audioContextReproductor.sampleRate);
        // Rellena el buffer con valores aleatorios
        // Recordatoriio: Cada dato del sonido es un número aleatorio entre -1 y 1
        // Ese patron aleatorio es lo que produce el sonido de "shhhh"
        const output = noiseBufferReproductor.getChannelData(0);
        for (let i = 0; i < noiseBufferReproductor.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }
}

function seleccionarSonidoReproductor(tipo, event) {
    document.querySelectorAll('.btn-sonido').forEach(btn => {
        btn.classList.remove('activo');
    });

    event.currentTarget.classList.add('activo');
    sonidoActualReproductor = tipo;

    if (isPlayingReproductor) {
        detenerTodoReproductor();
        togglePlayPauseReproductor();
    }
}

function togglePlayPauseReproductor() {
    // Se va a asegurar que el AudioContext y los nodos esten listos
    inicializarAudioReproductor();

    const btnPlay = document.getElementById('btnPlayReproductor');

    if (!isPlayingReproductor) {
        if (!sonidoActualReproductor) {
            alert('Por favor selecciona un sonido primero');
            return;
        }

        reproducirSonidoReproductor(sonidoActualReproductor);
        isPlayingReproductor = true;
        btnPlay.textContent = '⏸️';
        btnPlay.classList.add('activo');
    } else {
        pausarSonidoReproductor();
        isPlayingReproductor = false;
        btnPlay.textContent = '▶️';
        btnPlay.classList.remove('activo');
    }
}
// Genera y reproduce el sonido 
// Recordatorio: Se usa la web audio api
// Recordatorio 2: Crea el sonido artificialmente a partir de ruido blanco y lo filtra
function reproducirSonidoReproductor(tipo) {
    // Crea un nodo que puede reproducir un buffer
    const source = audioContextReproductor.createBufferSource();
    // El ruido blanco que se genero antees
    source.buffer = noiseBufferReproductor;
    // Hace que el sonido no se detenga
    source.loop = true;

    // Transforma el ruido blanco de antes para que suene como los sonidos existentes
    const filter = audioContextReproductor.createBiquadFilter();

    switch (tipo) {
        case 'lluvia':
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 0.5;
            break;
        case 'olas':
            filter.type = 'lowpass';
            filter.frequency.value = 800;
            break;
        case 'bosque':
            filter.type = 'highpass';
            filter.frequency.value = 2000;
            break;
        case 'fuego':
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            break;
    }

    //Conecta todo
    source.connect(filter);
    filter.connect(gainNodeReproductor);
    source.start();

    // Guarda la referencia para poder pausarlo o detenerlo luego
    oscillatorReproductor = source;
}

function pausarSonidoReproductor() {
    // oscillatorReproductor guarda la fuente del ruido blando que esta sonando
    if (oscillatorReproductor) {
        oscillatorReproductor.stop();
        oscillatorReproductor = null;
    }
}

function detenerTodoReproductor() {
    pausarSonidoReproductor();
    isPlayingReproductor = false;
    document.getElementById('btnPlayReproductor').textContent = '▶️';
    document.getElementById('btnPlayReproductor').classList.remove('activo');

    document.querySelectorAll('.btn-sonido').forEach(btn => {
        btn.classList.remove('activo');
    });

    sonidoActualReproductor = null;
}

function ajustarVolumenReproductor(valor) {
    // Convierte el valor de html de 0-100 al de web audio api 0-1
    const volumen = valor / 100;
    if (gainNodeReproductor) {
        // Cambia el volumen real del sonido
        gainNodeReproductor.gain.value = volumen;
    }
    document.getElementById('valorVolumenReproductor').textContent = valor + '%';
}
 // Evita que queden sonidos pegados al cerrar la pagina o recargarla
window.addEventListener('beforeunload', () => {
    detenerTodoReproductor();
    if (audioContextReproductor) {
        audioContextReproductor.close();
    }
});