const filtros = {
    hospital: '',
    especialidad: ''
}

// Función para mostrar los doctores en el HTML
function mostrarDoctores(doctores) {
    const doctorsList = document.querySelector('.doctors-list');
    doctorsList.innerHTML = '<h2>Doctores:</h2>'; // Resetear el contenido
    
    doctores.forEach(doctor => {
        const doctorItem = document.createElement('div');
        doctorItem.className = 'doctor-item';
        
        // Convertir hospitales y especialidades a strings si son arrays
        const hospitales = Array.isArray(doctor.hospitales) ? 
            doctor.hospitales.join(' | ') : doctor.hospitales;
        const especialidad = Array.isArray(doctor.especialidad) ? 
            doctor.especialidad.join(' | ') : doctor.especialidad;
        
        doctorItem.innerHTML = `
            <span class="doctor-name">${doctor.doctor}</span>
            <div class="doctor-info">
                <p><strong>Especialidad:</strong> ${especialidad}</p>
                <p><strong>Hospitales:</strong> ${hospitales}</p>
                <p><strong>Cédula Profesional:</strong> ${doctor.cedula1}</p>
                <p><strong>Cédula Especial:</strong> ${doctor.cedula2 || 'No disponible'}</p>
                <p><strong>Cédula Maestría:</strong> ${doctor.cedula3 || 'No disponible'}</p>
                <p><strong>Telefono:</strong> ${doctor.telefono}</p>
                <p><strong>WhatsApp:</strong> ${doctor.whatsapp}</p>
                <p><strong><a target="_blank" href="${doctor.web}">Página Web</a></strong></p>
            </div>
            <span class="cita-button"><button class="info-toggle-btn">Haz cita!</button></span>
        `;
        
        doctorsList.appendChild(doctorItem);
    });
    
    // Volver a asignar los event listeners a los botones
    asignarEventListeners();
}

// Función para filtrar doctores
function filtrarDoctores() {
    const hospitalSeleccionado = document.getElementById('hospitales').value;
    const especialidadSeleccionada = document.getElementById('especialidad').value;
    
    const doctoresFiltrados = listaDoctores.filter(doctor => {
        const hospitalMatch = !hospitalSeleccionado || 
            (Array.isArray(doctor.hospitales) ? doctor.hospitales.includes(hospitalSeleccionado) : doctor.hospitales.includes(hospitalSeleccionado));
        const especialidadMatch = !especialidadSeleccionada || 
            (Array.isArray(doctor.especialidad) ? 
                doctor.especialidad.includes(especialidadSeleccionada) :
                doctor.especialidad === especialidadSeleccionada);
        
        return hospitalMatch && especialidadMatch;
    });

    if (doctoresFiltrados.length === 0) {
        mostrarAlertaNoResultados();
    } else {
        ocultarAlertaNoResultados();
    }

    mostrarDoctores(doctoresFiltrados);
}

function mostrarAlertaNoResultados() {
    // Verificar si ya existe la alerta para no duplicarla
    if (!document.getElementById('alerta-no-resultados')) {
        const alertaHTML = `
            <div id="alerta-no-resultados" class="alert alert-warning mt-3">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                No se encontraron doctores con los criterios seleccionados.
                Por favor, intenta con otros filtros.
            </div>
        `;
        
        // Insertar la alerta después del formulario de búsqueda
        document.querySelector('.search-bar').insertAdjacentHTML('afterend', alertaHTML);
    }
}

function ocultarAlertaNoResultados() {
    const alerta = document.getElementById('alerta-no-resultados');
    if (alerta) {
        alerta.remove();
    }
}

// Función para asignar event listeners a los botones
function asignarEventListeners() {
    document.querySelectorAll('.info-toggle-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const item = this.closest('.doctor-item');
            const isAlreadyOpen = item.classList.contains('show-info');

            document.querySelectorAll('.doctor-item').forEach(i => i.classList.remove('show-info'));

            if (!isAlreadyOpen) {
                item.classList.add('show-info');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Mostrar todos los doctores al cargar la página
    mostrarDoctores(listaDoctores);
    
    // Asignar event listeners a los filtros
    document.getElementById('hospitales').addEventListener('change', filtrarDoctores);
    document.getElementById('especialidad').addEventListener('change', filtrarDoctores);
    
    // Cierra los cuadros al hacer clic fuera
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.doctor-item')) {
            document.querySelectorAll('.doctor-item').forEach(item => {
                item.classList.remove('show-info');
            });
        }
    });
});