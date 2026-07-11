-- ==========================================
-- SCRIPT DEFINITIVO DE CONFIGURACIÓN SUPABASE
-- SADCU - Sistema de Administración de Alumnos
-- ==========================================

-- 1. Limpieza de tablas existentes (evita conflictos de dependencias)
DROP TABLE IF EXISTS galeria_imagenes CASCADE;
DROP TABLE IF EXISTS categorias_actividades CASCADE;
DROP TABLE IF EXISTS comentarios CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- 2. Creación de Tabla de Usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Nota: Para producción real se recomienda usar Supabase Auth
    nombre TEXT,
    apellido TEXT,
    role TEXT DEFAULT 'alumno', -- 'admin' o 'alumno'
    estado TEXT DEFAULT 'activo', -- 'activo' o 'inactivo'
    nacimiento TEXT,
    telefono TEXT,
    foto_url TEXT,
    fechaRegistro TIMESTAMPTZ DEFAULT now(),
    activo BOOLEAN DEFAULT true
);

-- 3. Creación de Tabla de Comentarios
CREATE TABLE comentarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT,
    username TEXT,
    role TEXT,
    texto TEXT,
    fecha TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 4. Creación de Estructura para Categorías y Galería (Storage/Actividades)
CREATE TABLE categorias_actividades (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE galeria_imagenes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    url TEXT NOT NULL,
    categoria_id BIGINT REFERENCES categorias_actividades(id) ON DELETE CASCADE,
    titulo TEXT,
    descripcion TEXT,
    subido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_creacion TIMESTAMPTZ DEFAULT now()
);

-- 5. Inicialización de Buckets de Almacenamiento (Supabase Storage)
-- 'perfiles': para fotos de perfil de alumnos/admins
-- 'actividades': para imágenes de la galería y clases
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('perfiles', 'perfiles', true),
  ('actividades', 'actividades', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Carga de Datos Semilla: Administradores
INSERT INTO usuarios (username, password, email, dni, nombre, apellido, role, activo)
VALUES 
('CarlaSadcu', 'Sadcu2024!', 'carla@sadcu.edu.ar', '10000001', 'Carla', 'Admin', 'admin', true),
('FacuSadcu', 'Sadcu2024!', 'facu@sadcu.edu.ar', '10000002', 'Facu', 'Admin', 'admin', true),
('OmarSadcu', 'Sadcu2024!', 'omar@sadcu.edu.ar', '10000003', 'Omar', 'Admin', 'admin', true);

-- 7. Carga de Datos Semilla: Alumnos
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

-- 8. Carga de Datos Semilla: Categorías de Actividad
INSERT INTO categorias_actividades (nombre, descripcion)
VALUES 
  ('Eventos', 'Fotos de eventos especiales y torneos'),
  ('Exámenes', 'Fotos de graduaciones y exámenes de rango'),
  ('Entrenamiento', 'Fotos de las clases diarias'),
  ('Disciplinas', 'Imágenes representativas de cada arte marcial')
ON CONFLICT (nombre) DO NOTHING;

-- 9. Políticas de Seguridad RLS (Row Level Security)

-- Nota de Seguridad para desarrollo: 
-- Para este proyecto, el frontend consume las tablas de "usuarios" y "comentarios" directamente a través de consultas.
-- Por lo tanto, mantenemos estas tablas sin RLS estricto o con RLS desactivado por defecto para facilitar el desarrollo rápido,
-- o bien puedes habilitar RLS y definir políticas públicas si deseas producción estricta.

-- Habilitar RLS para tablas de la galería
ALTER TABLE categorias_actividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria_imagenes ENABLE ROW LEVEL SECURITY;

-- Políticas de categorías
CREATE POLICY "Categorías: Lectura pública" ON categorias_actividades FOR SELECT USING (true);
CREATE POLICY "Categorías: Solo admins gestionan" ON categorias_actividades FOR ALL USING (
    exists (select 1 from usuarios where id = auth.uid() and role = 'admin')
);

-- Políticas de galería
CREATE POLICY "Galería: Lectura pública" ON galeria_imagenes FOR SELECT USING (true);
CREATE POLICY "Galería: Solo admins gestionan" ON galeria_imagenes FOR ALL USING (
    exists (select 1 from usuarios where id = auth.uid() and role = 'admin')
);

-- Políticas para Storage (storage.objects)
-- BUCKET: perfiles
CREATE POLICY "Perfiles: Acceso Público" ON storage.objects FOR SELECT USING ( bucket_id = 'perfiles' );
CREATE POLICY "Perfiles: Usuarios suben su propia foto" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'perfiles' AND (auth.uid())::text = (storage.foldername(name))[1] );
CREATE POLICY "Perfiles: Usuarios actualizan su foto" ON storage.objects FOR UPDATE
USING ( bucket_id = 'perfiles' AND (auth.uid())::text = (storage.foldername(name))[1] );
CREATE POLICY "Perfiles: Usuarios borran su foto" ON storage.objects FOR DELETE
USING ( bucket_id = 'perfiles' AND (auth.uid())::text = (storage.foldername(name))[1] );

-- BUCKET: actividades
CREATE POLICY "Actividades: Acceso Público" ON storage.objects FOR SELECT USING ( bucket_id = 'actividades' );
CREATE POLICY "Actividades: Solo admins suben/editan/borran" ON storage.objects FOR ALL
USING (
    bucket_id = 'actividades' 
    AND exists (
        select 1 from usuarios 
        where id = auth.uid() and role = 'admin'
    )
);
