let historialPresion = [];
const ctx = document.getElementById('pressureChart').getContext('2d');
const btnRegistrarPresion = document.querySelector('#btnRegistrarPresion')
const btnBorrar = document.querySelector('#btnBorrar')
let myChart;

function inicializarGrafica() {
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historialPresion.map(item => item.fecha),
            datasets: [{
                label: 'Presión Sistólica',
                data: historialPresion.map(item => item.sistolica),
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }, {
                label: 'Presión Diastólica',
                data: historialPresion.map(item => item.diastolica),
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function actualizarGrafica() {
    myChart.data.labels = historialPresion.map(item => item.fecha);
    myChart.data.datasets[0].data = historialPresion.map(item => item.sistolica);
    myChart.data.datasets[1].data = historialPresion.map(item => item.diastolica);
    myChart.update();
}

function registrarPresion() {
    const fechaInput = document.getElementById('fechaInput');
    const sistolicaInput = document.getElementById('sistolicaInput');
    const diastolicaInput = document.getElementById('diastolicaInput');
    const resultadoPresionElement = document.getElementById('resultadoPresion');

    const fecha = fechaInput.value;
    const sistolica = parseInt(sistolicaInput.value);
    const diastolica = parseInt(diastolicaInput.value);

    if (fecha && !isNaN(sistolica) && !isNaN(diastolica)) {
        // Primero validamos si están dentro del rango
        if (sistolica < 60 || sistolica > 200 || diastolica < 40 || diastolica > 130) {
            alert("Valores fuera de rango. Ingresa una presión entre 60-200 sistólica y 40-130 diastólica.");
            return;
        }

        // Solo si es válido, registramos los datos
        historialPresion.push({ fecha, sistolica, diastolica });
        localStorage.setItem('historialPresion', JSON.stringify(historialPresion));

        let infoBasica = `Fecha: ${fecha}, Presión Sistólica: ${sistolica}, Presión Diastólica: ${diastolica}. `;
        let evaluacion
        resultadoPresionElement.style.backgroundColor = "white"; // Resetear color de fondo
        resultadoPresionElement.style.color = "black"; // Resetear color de texto

        // Determinar el estado de la presión
        if (sistolica < 70 || diastolica < 40) {
            evaluacion = "Valores extremadamente bajos. Busca atención médica.";
            resultadoPresionElement.style.backgroundColor = "purple";}
        else if (sistolica > 200 || diastolica > 130) {
            evaluacion = "Valores extremadamente altos. Busca atención médica.";
            resultadoPresionElement.style.backgroundColor = "red";
        } else if (sistolica < 80 || diastolica < 50) {
            evaluacion = "Tienes presión arterial baja (hipotensión severa).";
            resultadoPresionElement.style.backgroundColor = "blue";
            resultadoPresionElement.style.color = "white"; // Cambiar color de texto para mejor visibilidad
        } else if (sistolica < 85 || diastolica < 55) {
            evaluacion = "Tienes presión arterial baja (hipotensión moderada).";
            resultadoPresionElement.style.backgroundColor = "lightblue";
        } else if (sistolica < 90 || diastolica < 60) {
            evaluacion = "Tienes presión arterial baja (hipotensión leve).";
            resultadoPresionElement.style.backgroundColor = "lightgreen";
        } else if (sistolica < 120 && diastolica < 80) {
            evaluacion = "Tu presión es normal.";
            resultadoPresionElement.style.backgroundColor = "green";
        } else if (sistolica < 130 && diastolica < 80) {
            evaluacion = "Tu presión es elevada.";
            resultadoPresionElement.style.backgroundColor = "yellow";
        } else if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 80 && diastolica <= 89)) {
            evaluacion = "Tienes hipertensión en etapa 1.";
            resultadoPresionElement.style.backgroundColor = "orange";
        } else if ((sistolica >= 140 && sistolica < 180) || (diastolica >= 90 && diastolica < 120)) {
            evaluacion = "Tienes hipertensión en etapa 2.";
            resultadoPresionElement.style.backgroundColor = "red";
        } else if (sistolica >= 180 || diastolica >= 120) {
            evaluacion = "Crisis hipertensiva. Busca atención médica inmediata.";
            resultadoPresionElement.style.backgroundColor = "darkred";
        } else {
            evaluacion = "Revisa tus valores de presión.";
            resultadoPresionElement.style.backgroundColor = "black";
        }

        // Crear los párrafos y mostrar el resultado
        resultadoPresionElement.innerHTML = `<p>${infoBasica}</p>
        <p>Estado: <strong>${evaluacion}</stron></p>`;

        actualizarGrafica();

        // Limpiar los campos
        fechaInput.value = '';
        sistolicaInput.value = '';
        diastolicaInput.value = '';
    } else {
        alert("Por favor, ingresa una fecha y valores de presión válidos.");
    }
}



// Cargar el historial almacenado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const storedHistorial = localStorage.getItem('historialPresion');
    if (storedHistorial) {
        historialPresion = JSON.parse(storedHistorial);
    }

    btnRegistrarPresion.addEventListener('click', registrarPresion);
    btnBorrar.addEventListener('click', () => {
        localStorage.removeItem('historialPresion');
        historialPresion = [];
        actualizarGrafica();
    });
    inicializarGrafica(); // Inicializar la gráfica después de (posiblemente) cargar el historial
});