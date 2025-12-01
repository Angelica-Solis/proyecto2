
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let particles = [];
let particleCount = 80;
let mouse = { x: null, y: null, radius: 150 };

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let angle = Math.atan2(dy, dx);
                this.vx -= Math.cos(angle) * force * 0.2;
                this.vy -= Math.sin(angle) * force * 0.2;
            }
        }

        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
            this.vx = (this.vx / speed) * 2;
            this.vy = (this.vy / speed) * 2;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                let opacity = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    let gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
    );
    gradient.addColorStop(0, 'rgba(20, 20, 40, 1)');
    gradient.addColorStop(1, 'rgba(10, 10, 10, 1)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

init();
animate();

// Sistema de validacion
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formcontacto");
    const nombre = document.querySelector("input[name='nombre']");
    const correo = document.querySelector("input[name='correo']");
    const asunto = document.querySelector("input[name='asunto']");
    const mensaje = document.querySelector("textarea[name='mensaje']");
    const modal = document.getElementById("modalconfirmar");
    const cerrarModal = document.getElementById("cerrarmodal");
    const btnSubmit = form.querySelector("button[type='submit']");

    // Sistema de alertas flotantes
    const alertaDiv = document.createElement("div");
    alertaDiv.id = "alerta-flotante";
    alertaDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        display: none;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(alertaDiv);

    function mostrarAlerta(mensaje, tipo = "success") {
        const colores = {
            success: { bg: "#4CAF50", text: "#fff" },
            error: { bg: "#f44336", text: "#fff" },
            warning: { bg: "#ff9800", text: "#fff" },
            info: { bg: "#2196F3", text: "#fff" }
        };

        const color = colores[tipo] || colores.info;
        alertaDiv.style.backgroundColor = color.bg;
        alertaDiv.style.color = color.text;
        alertaDiv.textContent = mensaje;
        alertaDiv.style.display = "block";

        setTimeout(() => {
            alertaDiv.style.display = "none";
        }, 4000);
    }

    function validarNombre() {
        const valor = nombre.value.trim();
        if (valor.length < 3) {
            mostrarAlerta("El nombre debe tener al menos 3 caracteres", "error");
            nombre.focus();
            return false;
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
            mostrarAlerta("El nombre solo puede contener letras", "error");
            nombre.focus();
            return false;
        }
        return true;
    }

    function validarCorreo() {
        const valor = correo.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(valor)) {
            mostrarAlerta("Por favor ingresa un correo electrónico válido", "error");
            correo.focus();
            return false;
        }
        return true;
    }

    function validarAsunto() {
        const valor = asunto.value.trim();
        if (valor.length < 5) {
            mostrarAlerta("El asunto debe tener al menos 5 caracteres", "error");
            asunto.focus();
            return false;
        }
        if (valor.length > 100) {
            mostrarAlerta("El asunto no puede exceder 100 caracteres", "error");
            asunto.focus();
            return false;
        }
        return true;
    }

    function validarMensaje() {
        const valor = mensaje.value.trim();
        if (valor.length < 20) {
            mostrarAlerta("El mensaje debe tener al menos 20 caracteres", "error");
            mensaje.focus();
            return false;
        }
        if (valor.length > 1000) {
            mostrarAlerta("El mensaje no puede exceder 1000 caracteres", "error");
            mensaje.focus();
            return false;
        }
        return true;
    }

    function validarRecaptcha() {
        if (typeof grecaptcha === 'undefined') {
            console.error("Google reCAPTCHA no está cargado");
            mostrarAlerta("Error al cargar el sistema de seguridad. Por favor recarga la página.", "error");
            return false;
        }

        const response = grecaptcha.getResponse();

        if (!response || response.length === 0) {
            mostrarAlerta("Por favor, completa la verificación de seguridad (reCAPTCHA)", "warning");
            const captchaElement = document.querySelector('.g-recaptcha');
            if (captchaElement) {
                captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }

        console.log("reCAPTCHA validado correctamente");
        return true;
    }

    function validarFormulario() {
        return validarNombre() &&
            validarCorreo() &&
            validarAsunto() &&
            validarMensaje() &&
            validarRecaptcha();
    }

    function mostrarModalConfirmacion() {
        document.getElementById("modalnombre").textContent = nombre.value.trim();
        document.getElementById("modalcorreo").textContent = correo.value.trim();
        document.getElementById("modalasunto").textContent = asunto.value.trim();
        document.getElementById("modalmensaje").textContent = mensaje.value.trim();
        modal.style.display = "block";
        modal.classList.add("mostrar");
    }

    // Limpiar formulario
    function limpiarFormulario() {
        form.reset();
        // Resetear también el reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
    }

    cerrarModal.addEventListener("click", function () {
        modal.style.display = "none";
        modal.classList.remove("mostrar");
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            modal.classList.remove("mostrar");
        }
    });

    function deshabilitarBoton() {
        btnSubmit.disabled = true;
        btnSubmit.style.opacity = "0.6";
        btnSubmit.style.cursor = "not-allowed";
        btnSubmit.textContent = "Enviando...";
    }

    function habilitarBoton() {
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = "1";
        btnSubmit.style.cursor = "pointer";
        btnSubmit.textContent = "Enviar";
    }

    // Envio del formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validarFormulario()) {
            return false;
        }

        mostrarModalConfirmacion();
        deshabilitarBoton();
        mostrarAlerta("Enviando mensaje...", "info");

        // Enviar usando AJAX para evitar redirección
        const formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
                // Con no-cors se llega aqui y solo asume que se envio
                mostrarAlerta("✓ Mensaje enviado exitosamente", "success");
                setTimeout(() => {
                    limpiarFormulario();
                    habilitarBoton();

                    // Cerrar modal automáticamente
                    modal.style.display = "none";
                    modal.classList.remove("mostrar");
                }, 1500);
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarAlerta("Error al enviar el mensaje. Por favor intenta nuevamente.", "error");
                habilitarBoton();
            });

        return false;
    });

    // Validacion en tiempo real
    nombre.addEventListener("blur", function () {
        if (nombre.value.trim().length > 0) {
            validarNombre();
        }
    });

    correo.addEventListener("blur", function () {
        if (correo.value.trim().length > 0) {
            validarCorreo();
        }
    });

    asunto.addEventListener("blur", function () {
        if (asunto.value.trim().length > 0) {
            validarAsunto();
        }
    });

    mensaje.addEventListener("blur", function () {
        if (mensaje.value.trim().length > 0) {
            validarMensaje();
        }
    });

});


// Menu hamburguesa
function toggleMobileMenu() {
    const menu = document.getElementById('menumovil');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

document.addEventListener('click', function (event) {
    const menu = document.getElementById('menumovil');
    const menuButton = event.target.closest('.menuburbuja button');

    if (menu && !menu.contains(event.target) && !menuButton) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
});