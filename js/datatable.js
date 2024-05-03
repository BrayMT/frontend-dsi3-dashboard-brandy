$(document).ready(function() {
    $('#dataTable').DataTable({
        language: {
            url: "js/datatable-spanish.json" // Reemplaza "ruta/a/lang" con la ubicación real del archivo en tu proyecto
        },
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]]
    });
});