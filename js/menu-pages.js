$(function() {
    // Función para cargar contenido al hacer clic en un enlace
    $('a.cargar-contenido').click(function(event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace

        var url = $(this).attr('href'); // Obtiene la URL del enlace

        // Realiza una petición AJAX para obtener el contenido del archivo HTML
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'html',
            success: function(data) {
                // Inserta el contenido obtenido dentro del div #contenido
                $('#contenido').html(data);
                // Llama a cargarDatosDelAPI después de insertar el contenido HTML
                cargarDatosDelAPI();
            },
            error: function(xhr, status, error) {
                // Maneja el error si la petición falla
                console.error(error);
            }
        });
    });
});

