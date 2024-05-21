async function inicializarDataTable() {
    const dataTableElement = $('#dataTable');
    if ($.fn.DataTable.isDataTable(dataTableElement)) {
        dataTableElement.DataTable().destroy(); // Destruye la tabla DataTable existente
    }

    await $(document).ready(function() {
        dataTableElement.DataTable({
            language: {
                url: "js/datatable-spanish.json"
            },
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"]]
        });
    });
}