-- SCRIPT DEFINITIVO: LIMPIEZA, CREACIÓN Y MIGRACIÓN
-- Este script borrará la tabla actual y la creará correctamente con todos los campos.

-- 1. Borrar tablas existentes (para asegurar limpieza total)
DROP TABLE IF EXISTS comentarios;
DROP TABLE IF EXISTS usuarios;

-- 2. Crear Tabla de Usuarios con TODOS los campos
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nombre TEXT,
    apellido TEXT,
    role TEXT DEFAULT 'alumno',
    estado TEXT DEFAULT 'activo',
    nacimiento TEXT,
    telefono TEXT,
    fechaRegistro TIMESTAMPTZ DEFAULT now(),
    activo BOOLEAN DEFAULT true
);

-- 3. Crear Tabla de Comentarios
CREATE TABLE comentarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT,
    username TEXT,
    role TEXT,
    texto TEXT,
    fecha TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 4. Cargar Administradores
INSERT INTO usuarios (username, password, email, dni, nombre, apellido, role, activo)
VALUES 
('CarlaSadcu', 'Sadcu2024!', 'carla@sadcu.edu.ar', '10000001', 'Carla', 'Admin', 'admin', true),
('FacuSadcu', 'Sadcu2024!', 'facu@sadcu.edu.ar', '10000002', 'Facu', 'Admin', 'admin', true),
('OmarSadcu', 'Sadcu2024!', 'omar@sadcu.edu.ar', '10000003', 'Omar', 'Admin', 'admin', true);

-- 5. Cargar Alumnos
INSERT INTO usuarios (username, password, nombre, apellido, dni, email, telefono, role, estado, nacimiento, fechaRegistro, activo)
VALUES 
('mariagonzalez', 'Maria2023!', 'María', 'González', '35467812', 'maria.gonzalez@email.com', '1122334455', 'alumno', 'activo', '25-04-1985', '2023-01-10', true),
('carlosrodriguez', 'Carlos456@', 'Carlos', 'Rodríguez', '28965473', 'carlos.rodriguez@email.com', '1155667788', 'alumno', 'activo', NULL, '2023-02-15', true),
('anamartinez', 'Alumno789$', 'Ana', 'Martínez', '40123456', 'ana.martinez@email.com', '1199887766', 'alumno', 'activo', NULL, '2023-03-05', true),
('luisfernandez', 'Luis2023#', 'Luis', 'Fernández', '32456789', 'luis.fernandez@email.com', '1144556677', 'alumno', 'activo', NULL, '2022-08-20', true),
('sofialopez', 'Sofia567!', 'Sofía', 'López', '37891234', 'sofia.lopez@email.com', '1133445566', 'alumno', 'activo', NULL, '2023-04-18', true),
('juanperez', 'JuanPerez2023$', 'Juan', 'Pérez', '29876543', 'juan.perez@email.com', '1166778899', 'alumno', 'activo', NULL, '2022-11-30', true),
('valentinasanchez', 'Vale2023@', 'Valentina', 'Sánchez', '41234567', 'valentina.sanchez@email.com', '1188990011', 'alumno', 'activo', NULL, '2023-05-22', true),
('diegoramirez', 'Diego123!', 'Diego', 'Ramírez', '33445566', 'diego.ramirez@email.com', '1122339900', 'alumno', 'activo', NULL, '2023-06-10', true),
('camilatorres', 'Camila456#', 'Camila', 'Torres', '35678901', 'camila.torres@email.com', '1155443322', 'alumno', 'activo', NULL, '2023-07-15', true),
('migueldiaz', 'Miguel789$', 'Miguel', 'Díaz', '30987654', 'miguel.diaz@email.com', '1166554433', 'alumno', 'inactivo', NULL, '2022-10-05', true),
('luciaromero', 'Lucia2023!', 'Lucía', 'Romero', '42345678', 'lucia.romero@email.com', '1144668822', 'alumno', 'activo', NULL, '2023-08-12', true),
('andresgomez', 'Andres123@', 'Andrés', 'Gómez', '34567891', 'andres.gomez@email.com', '1122778899', 'alumno', 'activo', NULL, '2023-09-01', true),
('florenciavargas', 'Flor2023#', 'Florencia', 'Vargas', '38765432', 'florencia.vargas@email.com', '1188776655', 'alumno', 'activo', NULL, '2023-10-20', true),
('javiercastro', 'Javier567!', 'Javier', 'Castro', '31987654', 'javier.castro@email.com', '1133998877', 'alumno', 'activo', NULL, '2023-11-05', true),
('paulamolina', 'Paula2023$', 'Paula', 'Molina', '43678901', 'paula.molina@email.com', '1155778833', 'alumno', 'activo', NULL, '2023-12-15', true);
