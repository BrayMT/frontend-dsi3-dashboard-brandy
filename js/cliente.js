window.onload = async () => {
    await cargarDatosDelAPI();
};

// ESTA FUNCION HABILITA EL BUTTON
function validarCampos() {
    const nombres = document.getElementById('txtNombres').value;
    const apellidos = document.getElementById('txtApellidos').value;
    const direccion = document.getElementById('txtDireccion').value;
    const btnGrabar = document.getElementById('btnGrabar');

    const Caracteres_permitidos = (valor) => {
        const regex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
        return !regex.test(valor.trim());   
    };

    if (nombres.trim() !== "" && apellidos.trim() !== "" && direccion.trim() !== "" &&
        !Caracteres_permitidos(nombres) && !Caracteres_permitidos(apellidos) &&
        !Caracteres_permitidos(direccion)) {
        btnGrabar.disabled = false;
    } else {
        btnGrabar.disabled = true;
    }
}

document.getElementById('txtNombres').addEventListener('input', validarCampos);
document.getElementById('txtApellidos').addEventListener('input', validarCampos);
document.getElementById('txtDireccion').addEventListener('input', validarCampos);
document.getElementById('btnGrabar').addEventListener('click', function() {

});


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
                    <td>${dato.apellidos}</td>
                    <td>${dato.dni}</td>
                    <td>${dato.direccion}</td>
                    <td>
                        <button class='btn btn-success ms-2' onclick='buscarParaEditar(${dato.id})' data-bs-toggle='modal' data-bs-target='#modalFormulario'>Editar</button>
                        <button class='btn btn-danger' onclick='eliminarDato(${dato.id})'>Eliminar</button>
                    </td>
                </tr>
            `;
        });
        tablaBody.innerHTML = rows; 

        // inicializarDataTable(); 
          // Inicializar DataTable después de cargar los datos
        } catch (error) {
          console.error('Error al cargar datos:', error);
        }
      }
async function buscarParaEditar(id){
    try {
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/cliente/'+id);
        const dato = await response.json();
        document.getElementById('txtId').value = dato.id;
        document.getElementById('txtNombres').value = dato.nombres;
        document.getElementById('txtApellidos').value = dato.apellidos;
        document.getElementById('txtDni').value = dato.dni;
        document.getElementById('txtDireccion').value = dato.direccion;


    } catch (error) {

    }
}
//ESTO AGREGUE
function mostrarMensajeError(mensaje, campoId) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-danger');
    errorDiv.textContent = mensaje;
    errorDiv.classList.add('error-message')

    const campo = document.getElementById(campoId);
    campo.insertAdjacentElement('afterend', errorDiv); 

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function contieneNumerosOCaracteresNoPermitidos(valor) {
    const regex = /^[a-zA-Z\s]+$/; // Expresión regular para permitir solo letras y espacios
    return !regex.test(valor.trim());
}
//AQUI TERMINA

async function enviarDatosApi() {
    try {
        const id = document.getElementById('txtId').value;
        const nombres = document.getElementById('txtNombres').value;
        const apellidos = document.getElementById('txtApellidos').value;
        const dni = document.getElementById('txtDni').value;
        const direccion = document.getElementById('txtDireccion').value;

        // Verificar DNI repetido, ignorando el DNI del cliente actual al editar
        const dniExistentes = document.querySelectorAll('#rowsCliente td:nth-child(4)'); // Cambia al cuarto td que corresponde al DNI
        const dniRepetido = [...dniExistentes].some(td => td.textContent.trim() === dni.trim() && td.parentElement.firstElementChild.textContent.trim() !== id.trim());
        
        //ESTO AGREGUE
        const dniRegex = /^[0-9]+$/;
        const maxLongitudDNI = 8; // Máximo de 8 dígitos para el DNI
        const minLongitudDNI = 8; // Mínimo de 8 dígitos para el DNI

        if (dniRepetido ) {
            Swal.fire({
                icon: 'error',
                title: 'DNI repetido',
                text: 'El DNI ingresado ya existe en la lista. Por favor, ingresa un DNI diferente.',
                confirmButtonText: 'Entendido'
            });
            return; // Salir de la función si el DNI está repetido
        }

        // Validación del DNI (solo números y máximo de 8 y minimo dígitos)
        if (!dniRegex.test(dni) || dni.length < minLongitudDNI || dni.length > maxLongitudDNI) {
            mostrarMensajeError(`El DNI solo puede contener números y debe tener entre ${minLongitudDNI} y ${maxLongitudDNI} dígitos.`, 'txtDni');
            return;
       }
       //AQUI TERMINA
       

        const data = {
            "nombres": nombres,
            "apellidos": apellidos,
            "dni": dni,
            "direccion": direccion,
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

            btnGrabar.disabled = true;

            const modal = document.getElementById('modalFormulario');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide(); // Cerrar el modal
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

