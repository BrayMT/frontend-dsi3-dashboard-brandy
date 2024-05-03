vwindow.onload = () => {
    cargarDatosDelAPI();
};

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

async function enviarDatosApi() {
    try {
        const id = document.getElementById('txtId').value;
        const dni= document.getElementById('txtDni').value;
        const hora = document.getElementById('txtHora').value;
        const direccion = document.getElementById('txtDireccion').value;
        const estado_pedido= document.getElementById('txtEstado_pedido').value;
        const tiempo_entrega = document.getElementById('txtTiempo_entrega').value;

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


