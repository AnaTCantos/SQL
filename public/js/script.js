document.addEventListener('DOMContentLoaded', function () {
    const datos = JSON.parse(document.getElementById('datos-grafica').textContent);
    const ctx = document.getElementById('grafica').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.map(item => item.nombre),
            datasets: [{
                label: 'Ratio de Aprobados',
                data: datos.map(item => (item.aprobados / item.total) * 100),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje de Aprobados'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Cursos'
                    }
                }
            }
        }
    });
});