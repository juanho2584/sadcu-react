-- Script para crear las tablas necesarias en Supabase

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Nota: Para mayor seguridad, usar Supabase Auth en el futuro
    nombre TEXT,
    apellido TEXT,
    role TEXT DEFAULT 'alumno',
    estado TEXT DEFAULT 'activo',
    nacimiento TEXT,
    fechaRegistro TIMESTAMPTZ DEFAULT now(),
    activo BOOLEAN DEFAULT true,
    telefono TEXT
);

-- 2. Tabla de Comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nombre TEXT,
    username TEXT,
    role TEXT,
    texto TEXT,
    fecha TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Habilitar RLS (Opcional, pero recomendado)
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Si se habilita RLS, se deben definir políticas de acceso)
-- Ejemplo: Permitir lectura pública de comentarios
-- CREATE POLICY "Permitir lectura publica de comentarios" ON comentarios FOR SELECT USING (true);
