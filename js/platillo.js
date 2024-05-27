window.onload = () => {
    cargarDatosDelAPI();
};

// ESTA FUNCION HABILITA EL BUTTON
function validarCampos() {
    const nombre_platillo = document.getElementById('txtNombre_platillo').value;
    const descripcion = document.getElementById('txtDescripcion').value;
    const categoria = document.getElementById('txtCategoria').value;
    const precio = document.getElementById('txtPrecio').value;
    const btnGrabar = document.getElementById('btnGrabar');

    if (nombre_platillo.trim() !== "" && descripcion.trim() !== "" && categoria.trim() !== "" && precio.trim() !== "") {
        btnGrabar.disabled = false;
    } else {
        btnGrabar.disabled = true;
    }
}

// Modifica los campos de entrada para llamar a validarCampos() en cada cambio
document.getElementById('txtNombre_platillo').oninput = validarCampos;
document.getElementById('txtDescripcion').oninput = validarCampos;
document.getElementById('txtCategoria').oninput = validarCampos;
document.getElementById('txtPrecio').oninput = validarCampos;


//cargar los datos desde la api
async function cargarDatosDelAPI() {
    try {
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/platillo');
        const datos = await response.json();
        const tablaBody = document.getElementById('rowsPlatillo');

        let rows = '';
        datos.forEach(dato => {
            rows += `
                <tr>
                    <td>${dato.id}</td>
                    <td>${dato.nombre_platillo}</td>
                    <td>${dato.descripcion}</td>
                    <td>${dato.categoria}</td>
                    <td>${dato.precio}</td>
                    <td>
                        <button class='btn btn-success ms-2' onclick='buscarParaEditar(${dato.id})' data-bs-toggle='modal' data-bs-target='#modalFormulario'>Editar</button>
                        <button class='btn btn-danger' onclick='eliminarDato(${dato.id})'>Eliminar</button>
                    </td>
                </tr>
            `;
        });
        tablaBody.innerHTML = rows; 
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

async function buscarParaEditar(id){
    try {
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/platillo/'+id);
        const dato = await response.json();
        document.getElementById('txtId').value = dato.id;
        document.getElementById('txtNombre_platillo').value = dato.nombre_platillo;
        document.getElementById('txtDescripcion').value = dato.descripcion;
        document.getElementById('txtCategoria').value = dato.categoria;
        document.getElementById('txtPrecio').value = dato.precio;
       


    } catch (error) {
        
    }
}

async function enviarDatosApi() {
    try {
        const id = document.getElementById('txtId').value;
        const nombre_platillo = document.getElementById('txtNombre_platillo').value;
        const descripcion= document.getElementById('txtDescripcion').value;
        const categoria = document.getElementById('txtCategoria').value;
        const precio = document.getElementById('txtPrecio').value;

        if (!nombre_platillo || !descripcion || !categoria || !precio) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos antes de enviar los datos.',
                confirmButtonText: 'Entendido'
            });
            return; // Salir de la función si hay campos vacíos
        }
        
        const data = {
            "nombre_platillo":nombre_platillo,
            "descripcion": descripcion,
            "categoria": categoria,
            "precio": precio
        };

        if (!isNaN(id)) {
            Object.assign(data, { "id": id });
        }

        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/platillo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            cargarDatosDelAPI();
            document.getElementById("frmPlatillo").reset();

            // Agregar SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Datos enviados',
                text: 'Los datos se han enviado correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            console.error('Error al enviar los datos a la API:', response.statusText);
        }
    } catch (error) {
        console.error('Error al enviar los datos a la API:', error);
    }
}

async function eliminarDato(id) {
    try {
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacion.isConfirmed) {
            const response = await fetch(`http://localhost:8081/cruddsi3/api/v1/platillo/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                cargarDatosDelAPI(); // Recargar los datos después de la eliminación
                Swal.fire(
                    'Eliminado',
                    'El dato ha sido eliminado correctamente',
                    'success'
                );
            } else {
                console.error('Error al eliminar el dato:', response.statusText);
                Swal.fire(
                    'Error',
                    'Hubo un error al intentar eliminar el dato',
                    'error'
                );
            }
        }
    } catch (error) {
        console.error('Error al eliminar el dato:', error);
        Swal.fire(
            'Error',
            'Hubo un error al intentar eliminar el dato',
            'error'
        );
    }
}

function formReset(){
    document.getElementById("frmPlatillo").reset();
}