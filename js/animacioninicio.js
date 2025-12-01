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

// Animaciones de scroll
function observeScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.cajainfo, .cajacarrusel, .cajanueva');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
            }
        });
    }, {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: '0px 0px -50px 0px' // Ajusta cuándo se activa
    });

    elementsToAnimate.forEach(element => {
        element.classList.add('animacionscroll');
        observer.observe(element);
    });
}

// Iniciar observer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    observeScrollAnimations();
    cargarContenido();
});

// Carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.deslizadorcarrusel');
const dots = document.querySelectorAll('.puntocarrusel');
const prevBtn = document.querySelector('.carruselprev');
const nextBtn = document.querySelector('.carruselnext');
const totalSlides = slides.length;

function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach(slide => slide.classList.remove('activo'));
    dots.forEach(dot => dot.classList.remove('activo'));

    slides[currentSlide].classList.add('activo');
    dots[currentSlide].classList.add('activo');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

let autoSlide = setInterval(nextSlide, 5000);

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
}

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        showSlide(parseInt(dot.getAttribute('data-slide')));
        resetAutoSlide();
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoSlide();
    }
});

// Caja desplegable
function toggleBox() {
    const boxContent = document.querySelector('.contenidocaja');
    const toggleIcon = document.querySelector('.iconoalternar');
    const newBox = document.querySelector('.cajanueva');

    boxContent.classList.toggle('activo');
    newBox.classList.toggle('expandida');

    if (boxContent.classList.contains('activo')) {
        toggleIcon.textContent = '▲';
    } else {
        toggleIcon.textContent = '▼';
    }
}

// Carga el contenido desde JSON
async function cargarContenido() {
    try {
        const response = await fetch('json/inicio.json');
        const data = await response.json();

        document.querySelector('.subtitulo').textContent = data.subtitulo;
        document.querySelector('h1').textContent = data.titulo;
        document.querySelector('.contenido p').textContent = data.descripcion;

        const infoBox = document.querySelector('.cajainfo');
        infoBox.querySelector('h2').textContent = data.introduccion.titulo;

        const parrafos = infoBox.querySelectorAll('p');
        parrafos[0].textContent = data.introduccion.parrafos[0];
        parrafos[1].textContent = data.introduccion.beneficios_titulo;

        const beneficiosUl = infoBox.querySelector('ul');
        beneficiosUl.innerHTML = '';
        data.introduccion.beneficios.forEach(beneficio => {
            const li = document.createElement('li');
            li.textContent = beneficio;
            beneficiosUl.appendChild(li);
        });

        document.querySelector('.titulocarrusel').textContent = data.galeria.titulo;

        const slides = document.querySelectorAll('.deslizadorcarrusel');
        data.galeria.imagenes.forEach((imagen, index) => {
            if (slides[index]) {
                const img = slides[index].querySelector('img');
                const h3 = slides[index].querySelector('h3');
                const p = slides[index].querySelector('p');

                img.src = imagen.src;
                img.alt = imagen.alt;
                h3.textContent = imagen.titulo;
                p.textContent = imagen.descripcion;
            }
        });

        document.querySelector('.cajanueva h2').textContent = data.propuesta.titulo;
        document.querySelector('.contenidocaja p').textContent = data.propuesta.descripcion;

        const puntosUl = document.querySelector('.contenidocaja ul');
        puntosUl.innerHTML = '';
        data.propuesta.puntos.forEach(punto => {
            const li = document.createElement('li');
            li.textContent = punto;
            puntosUl.appendChild(li);
        });

    } catch (error) {
        console.error('Error al cargar el contenido:', error);
    }
}

// Menú hamburguesa
function toggleMobileMenu() {
    const menu = document.getElementById('menumovil');
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', function (event) {
    const menu = document.getElementById('menumovil');
    const menuButton = event.target.closest('.menuburbuja button');

    if (!menu.contains(event.target) && !menuButton) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
});