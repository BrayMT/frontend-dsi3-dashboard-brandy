window.onload = async () => {
    await cargarDatosDelAPI();
};

// ESTA FUNCION HABILITA EL BUTTON
function validarCampos() {
    const hora = document.getElementById('txtHora').value;
    const direccion = document.getElementById('txtDireccion').value;
    const estado_pedido = document.getElementById('txtEstado_pedido').value;
    const tiempo_entrega = document.getElementById('txtTiempo_entrega').value;
    const btnGrabar = document.getElementById('btnGrabar');

    const Caracteres_permitidos = (valor) => {
        const regex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
        return !regex.test(valor.trim());   
    };

    if (hora.trim() !== "" && direccion.trim() !== "" && estado_pedido.trim() !== "" && tiempo_entrega.trim() &&
        !Caracteres_permitidos(direccion) &&
        !Caracteres_permitidos(estado_pedido)) {
        btnGrabar.disabled = false;
    } else {
        btnGrabar.disabled = true;
    }
}
document.getElementById('txtHora').addEventListener('input', validarCampos);
document.getElementById('txtDireccion').addEventListener('input', validarCampos);
document.getElementById('txtEstado_pedido').addEventListener('input', validarCampos);
document.getElementById('txtTiempo_entrega').addEventListener('input', validarCampos);
document.getElementById('btnGrabar').addEventListener('click', function() {

});

//cargar los datos desde la api
async function cargarDatosDelAPI() {
    try {
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/delivery');
        const datos = await response.json();
        const tablaBody = document.getElementById('rowsDelivery');

        let rows = '';
        datos.forEach(dato => {
            rows += `
                <tr>
                    <td>${dato.id}</td>
                    <td>${dato.dni}</td>
                    <td>${dato.hora}</td>
                    <td>${dato.direccion}</td>
                    <td>${dato.estado_pedido}</td>
                    <td>${dato.tiempo_entrega}</td>

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
        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/delivery/'+id);
        const dato = await response.json();
        document.getElementById('txtId').value = dato.id;
        document.getElementById('txtDni').value = dato.dni;
        document.getElementById('txtHora').value = dato.hora;
        document.getElementById('txtDireccion').value = dato.direccion;
        document.getElementById('txtEstado_pedido').value = dato.estado_pedido;   
        document.getElementById('txtTiempo_entrega').value = dato.tiempo_entrega;


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

//AQUI TERMINA

async function enviarDatosApi() {
    try {
        const id = document.getElementById('txtId').value;
        const dni= document.getElementById('txtDni').value;
        const hora = document.getElementById('txtHora').value;
        const direccion = document.getElementById('txtDireccion').value;
        const estado_pedido= document.getElementById('txtEstado_pedido').value;
        const tiempo_entrega = document.getElementById('txtTiempo_entrega').value;

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
            "dni": dni,
            "hora": hora,
            "direccion": direccion,
            "estado_pedido": estado_pedido,
            "tiempo_entrega":tiempo_entrega
        };

        if (!isNaN(id)) {
            Object.assign(data, { "id": id });
        }

        const response = await fetch('http://localhost:8081/cruddsi3/api/v1/delivery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            cargarDatosDelAPI();
            document.getElementById("frmDelivery").reset();

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
            const response = await fetch(`http://localhost:8081/cruddsi3/api/v1/delivery/${id}`, {
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
    document.getElementById("frmDelivery").reset();
}


