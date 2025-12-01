
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
// Efecto de hover en botones interactivos
document.querySelectorAll('.botoninteractivo').forEach(button => {
    button.addEventListener('click', function () {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Cajas desplegables
function toggleContent(element) {
    const content = element.querySelector('.contenidoexpandible');
    const arrow = element.querySelector('.flecha');

    element.classList.toggle('expandido');

    if (element.classList.contains('expandido')) {
        arrow.textContent = '↑';
    } else {
        arrow.textContent = '↓';
    }
}

// Leer el JSON
document.addEventListener("DOMContentLoaded", () => {
    fetch("json/acercade.json")
        .then(response => response.json())
        .then(data => {

            document.querySelectorAll(".valorinfo")[0].textContent = data.nombre;

            document.querySelectorAll(".valorinfo")[1].textContent = data.correo;

            document.querySelector(".textodescripcion").textContent = data.descripcion;


        })
        .catch(error => console.log("Error al cargar el JSON:", error));
});
