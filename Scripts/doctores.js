
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.info-toggle-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Evita que el clic se propague al body

            const item = this.closest('.doctor-item');
            const isAlreadyOpen = item.classList.contains('show-info');

            // Cierra todos los cuadros
            document.querySelectorAll('.doctor-item').forEach(i => i.classList.remove('show-info'));

            // Solo muestra si no estaba ya abierto
            if (!isAlreadyOpen) {
                item.classList.add('show-info');
            }
        });
    });

    // Cierra los cuadros al hacer clic fuera
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.doctor-item')) {
            document.querySelectorAll('.doctor-item').forEach(item => {
                item.classList.remove('show-info');
            });
        }
    });
});
