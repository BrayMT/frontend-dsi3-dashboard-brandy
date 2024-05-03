window.onload = () => {
    cargarDatosDelAPI();
};

//cargar los datos desde la api
async function cargarDatosDelAPI() {
    try {
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/cliente');
        const datos = await response.json();
        const tablaBody = document.getElementById('rowsCliente');

        let rows = '';
        datos.forEach(dato => {
            rows += `
                <tr>
                    <td>${dato.id}</td>
                    <td>${dato.nombres}</td>
                    <td>${dato.dni}</td>
                    <td>${dato.apellidos}</td>
                    <td>${dato.direccion}</td>
                    <td>${dato.ciudad}</td>
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
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/cliente/'+id);
        const dato = await response.json();
        document.getElementById('txtId').value = dato.id;
        document.getElementById('txtNombres').value = dato.nombres;
        document.getElementById('txtDni').value = dato.dni;
        document.getElementById('txtApellidos').value = dato.apellidos;
        document.getElementById('txtDireccion').value = dato.direccion;
        document.getElementById('txtCiudad').value = dato.ciudad;


    } catch (error) {

    }
}

async function enviarDatosApi() {
    try {
        const id = document.getElementById('txtId').value;
        const nombres = document.getElementById('txtNombres').value;
        const dni = document.getElementById('txtDni').value;
        const apellidos = document.getElementById('txtApellidos').value;
        const direccion = document.getElementById('txtDireccion').value;
        const ciudad = document.getElementById('txtCiudad').value;

        // Verificar si algún campo está vacío
        if (!nombres || !dni || !apellidos || !direccion || !ciudad) {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos antes de enviar los datos.',
                confirmButtonText: 'Entendido'
            });
            return; // Salir de la función si hay campos vacíos
        }

        // Verificar si el nombre ya existe
        const dniExistentes = document.querySelectorAll('#rowsCliente td:nth-child(2)');
        const dniRepetido = [...dniExistentes].some(td => td.textContent.trim() === dni.trim());

        if (dniRepetido) {
            Swal.fire({
                icon: 'error',
                title: 'DNI repetido',
                text: 'El DNI ingresado ya existe en la lista. Por favor, ingresa un dni diferente.',
                confirmButtonText: 'Entendido'
            });
            return; // Salir de la función si el nombre está repetido
        }

        const data = {
            "nombres": nombres,
            "dni": dni,
            "apellidos": apellidos,
            "direccion": direccion,
            "ciudad": ciudad
        };

        if (!isNaN(id)) {
            Object.assign(data, { "id": id });
        }

        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            cargarDatosDelAPI();
            document.getElementById("frmCliente").reset();

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
            const response = await fetch(`http://localhost:8081/cruddsi3/api/v1/cliente/${id}`, {
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
    document.getElementById("frmCliente").reset();
}

