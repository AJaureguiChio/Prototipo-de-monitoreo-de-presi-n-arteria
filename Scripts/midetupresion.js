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
    if (historialPresion.length === 0) {
        // Si no hay datos, destruimos el gráfico existente y creamos uno vacío
        if (myChart) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Presión Sistólica',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                }, {
                    label: 'Presión Diastólica',
                    data: [],
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
    } else {
        // Actualizar gráfico con datos existentes
        myChart.data.labels = historialPresion.map(item => item.fecha);
        myChart.data.datasets[0].data = historialPresion.map(item => item.sistolica);
        myChart.data.datasets[1].data = historialPresion.map(item => item.diastolica);
        myChart.update();
    }
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
        if (sistolica <= 70 || diastolica <= 40) {
            evaluacion = "Valores extremadamente bajos. Busca atención médica.";
            resultadoPresionElement.style.backgroundColor = "purple";
        }
        else if (sistolica >= 200 || diastolica >= 130) {
            evaluacion = "Valores extremadamente altos. Busca atención médica.";
            resultadoPresionElement.style.backgroundColor = "red";
        } else if (sistolica <= 80 || diastolica <= 50) {
            evaluacion = "Tienes presión arterial baja (hipotensión severa).";
            resultadoPresionElement.style.backgroundColor = "blue";
        } else if (sistolica <= 85 || diastolica <= 55) {
            evaluacion = "Tienes presión arterial baja (hipotensión moderada).";
            resultadoPresionElement.style.backgroundColor = "lightblue";
        } else if (sistolica <= 90 || diastolica <= 60) {
            evaluacion = "Tienes presión arterial baja (hipotensión leve).";
            resultadoPresionElement.style.backgroundColor = "lightgreen";
        } else if (sistolica < 120 && diastolica < 80) {
            evaluacion = "Tu presión es normal.";
            resultadoPresionElement.style.backgroundColor = "green";
        } else if (sistolica < 130 && diastolica < 80) {
            evaluacion = "Tu presión es elevada.";
            resultadoPresionElement.style.backgroundColor = "yellow";
        } else if ((sistolica > 130 && sistolica < 139) || (diastolica >= 80 && diastolica <= 89)) {
            evaluacion = "Tienes hipertensión en etapa 1.";
            resultadoPresionElement.style.backgroundColor = "orange";
        } else if ((sistolica > 140 && sistolica < 180) || (diastolica >= 90 && diastolica < 120)) {
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
        resultadoPresionElement.innerHTML = `
            <div class="mb-3">
                <p>${infoBasica}</p>
                <p>Estado: <strong>${evaluacion}</strong></p>
            </div>
            <div class="consejos-container">
                ${generarConsejos(sistolica, diastolica)}
            </div>
        `;

        actualizarGrafica();

        // Limpiar los campos
        fechaInput.value = '';
        sistolicaInput.value = '';
        diastolicaInput.value = '';
    } else {
        alert("Por favor, ingresa una fecha y valores de presión válidos.");
    }
}

// Añade esta función al archivo midetupresion.js
function generarConsejos(sistolica, diastolica) {
    let consejos = "<h3>Consejos para tu presión arterial:</h3>";

    if (sistolica <= 70 || diastolica <= 40) {
        consejos += `
        <div class="alert alert-danger">
            <h4>🚨 Emergencia médica</h4>
            <ul>
                <li>Busca atención médica inmediata</li>
                <li>No intentes automedicarte</li>
                <li>Siéntate o recuéstate para evitar caídas</li>
            </ul>
        </div>`;
    }
    else if (sistolica >= 200 || diastolica >= 130) {
        consejos += `
        <div class="alert alert-danger">
            <h4>🚨 Crisis hipertensiva</h4>
            <ul>
                <li>Busca atención médica URGENTE</li>
                <li>Evita el estrés y permanece en reposo</li>
                <li>No consumas sal, cafeína ni alcohol</li>
            </ul>
        </div>`;
    }
    else if (sistolica <= 90 || diastolica <= 60) {
        consejos += `
        <div class="alert alert-info">
            <h4>🔵 Presión baja (Hipotensión)</h4>
            <ul>
                <li>Toma más agua para aumentar el volumen sanguíneo</li>
                <li>Consume pequeñas porciones de alimentos salados</li>
                <li>Leviántate lentamente para evitar mareos</li>
                <li>Considera usar medias de compresión</li>
            </ul>
        </div>`;
    }
    else if (sistolica < 120 && diastolica < 80) {
        consejos += `
        <div class="alert alert-success">
            <h4>🟢 Presión normal</h4>
            <ul>
                <li>¡Sigue así! Mantén tus hábitos saludables</li>
                <li>Continúa con ejercicio regular</li>
                <li>Mide tu presión periódicamente</li>
            </ul>
        </div>`;
    }
    // CONDICIÓN MODIFICADA PARA PRESIÓN ELEVADA (121-129/<80)
    else if (sistolica >= 120 && sistolica <= 129 && diastolica < 80) {
        consejos += `
        <div class="alert alert-warning">
            <h4>🟡 Presión elevada (Prehipertensión)</h4>
            <ul>
                <li>Reduce el consumo de sal a menos de 1,500 mg/día</li>
                <li>Realiza 40 minutos de ejercicio aeróbico 4 veces/semana</li>
                <li>Controla tu peso (perder 5% ayuda significativamente)</li>
                <li>Limita el alcohol a 1 bebida/día (mujeres) o 2 (hombres)</li>
                <li>Mide tu presión 2 veces por semana</li>
            </ul>
        </div>`;
    }
    else if ((sistolica >= 130 && sistolica < 140) || (diastolica >= 80 && diastolica < 90)) {
        consejos += `
        <div class="alert alert-warning">
            <h4>🟠 Hipertensión Etapa 1</h4>
            <ul>
                <li>Consulta a un médico para evaluación</li>
                <li>Reduce el consumo de alcohol y cafeína</li>
                <li>Adopta la dieta DASH (rica en frutas y verduras)</li>
                <li>Realiza al menos 150 minutos de ejercicio semanal</li>
            </ul>
        </div>`;
    }
    else if ((sistolica >= 140 && sistolica < 180) || (diastolica >= 90 && diastolica < 120)) {
        consejos += `
        <div class="alert alert-danger">
            <h4>🔴 Hipertensión Etapa 2</h4>
            <ul>
                <li>Consulta a un médico inmediatamente</li>
                <li>Reduce drásticamente el consumo de sal</li>
                <li>Evita completamente el alcohol y tabaco</li>
                <li>Controla tu presión diariamente</li>
                <li>Toma los medicamentos según prescripción médica</li>
            </ul>
        </div>`;
    }
    else if (sistolica >= 180 || diastolica >= 120) {
        consejos += `
        <div class="alert alert-danger">
            <h4>🚨 Crisis hipertensiva</h4>
            <ul>
                <li>Busca atención médica INMEDIATA</li>
                <li>Permanece en reposo absoluto</li>
                <li>No consumas ningún alimento hasta ser evaluado</li>
            </ul>
        </div>`;
    }

    // Consejos generales para todos
    consejos += `
    <div class="mt-3">
        <h4>💡 Recomendaciones generales:</h4>
        <ul>
            <li>Mide tu presión regularmente</li>
            <li>Mantén un peso saludable</li>
            <li>Duerme 7-8 horas diarias</li>
            <li>Controla el estrés con técnicas de relajación</li>
        </ul>
    </div>`;

    return consejos;
}



// Cargar el historial almacenado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const storedHistorial = localStorage.getItem('historialPresion');
    if (storedHistorial) {
        historialPresion = JSON.parse(storedHistorial);
    }

    btnRegistrarPresion.addEventListener('click', registrarPresion);
    btnBorrar.addEventListener('click', () => {
    if (confirm("¿Estás seguro de que quieres borrar todo el historial de presión?")) {
        localStorage.removeItem('historialPresion');
        historialPresion = [];
        actualizarGrafica();
        
        // Limpiar los campos de entrada
        document.getElementById('fechaInput').value = '';
        document.getElementById('sistolicaInput').value = '';
        document.getElementById('diastolicaInput').value = '';
        
        // Limpiar los mensajes y consejos
        document.getElementById('resultadoPresion').innerHTML = '';
        document.getElementById('resultadoPresion').style.backgroundColor = 'white';
        document.getElementById('resultadoPresion').style.color = 'black';
        
        // Opcional: Mostrar mensaje de confirmación
        alert("Historial borrado correctamente");
    }
});
    inicializarGrafica(); // Inicializar la gráfica después de (posiblemente) cargar el historial
});