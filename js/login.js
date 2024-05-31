document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Validación en el cliente
    var username = event.target.username.value;
    var password = event.target.password.value;
    if (username && password) {
        return true; // Permitir el envío del formulario
    } else {
        alert('Por favor, complete todos los campos.');
        event.preventDefault(); // Prevenir el envío del formulario
    }
});