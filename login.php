<?php
session_start();

// Configuración de la conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = ""; // Dejar vacío si no hay contraseña
$dbname = "base_de_datos";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si se ha enviado el formulario de login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    // Consulta para verificar las credenciales
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $hash);
        $stmt->fetch();

        if (password_verify($password, $hash)) {
            // Establecer la sesión del usuario
            $_SESSION['user_id'] = $user_id;
            // Redirigir a index.html después de un inicio de sesión exitoso
            header('Location: index.html');
            exit();
        } else {
            header('Location: error.html?message=Credenciales incorrectas');
            exit();
        }
    } else {
        header('Location: error.html?message=Usuario no encontrado');
        exit();
    }

    $stmt->close();
}

$conn->close();
?>