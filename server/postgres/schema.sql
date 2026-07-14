CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Malta · schema (actualizado con las respuestas del cliente al cuestionario CRM/Intranet)

CREATE TYPE user_role AS ENUM ('admin', 'direccion', 'profesor', 'comercial', 'gestor_andorra', 'alumno');
CREATE TYPE territory AS ENUM ('malta', 'andorra');
CREATE TYPE course_mode AS ENUM ('online', 'hybrid');
CREATE TYPE course_level AS ENUM ('degree', 'postgrad');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LMS
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Cada título tiene características propias (respuesta del cliente):
  -- de momento modalidad + nivel: el catálogo real puede crecer con más
  -- campos (duración, créditos...) cuando se necesiten.
  mode course_mode NOT NULL DEFAULT 'online',
  level course_level NOT NULL DEFAULT 'degree',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  status TEXT NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CRM
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  territory territory NOT NULL,
  -- Etapas reales del proceso de venta (respuesta del cliente): contacto
  -- inicial por llamada/email -> se da información -> matrícula por la web
  -- -> administración envía el contrato. Sin distinción por territorio:
  -- todos los comerciales ven todos los leads (también respuesta del cliente).
  stage TEXT NOT NULL DEFAULT 'nuevo',
  assigned_to UUID REFERENCES users(id),
  -- Consentimiento explícito RGPD para email marketing (el cliente confirmó
  -- que sí hacen email marketing a los leads). marketing_consent_at guarda
  -- cuándo se dio el consentimiento, como evidencia ante una auditoría.
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Intranet
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  folder TEXT,
  visibility_role user_role,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pendiente',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Una tarea puede tener uno o varios asignados (respuesta del cliente:
-- "depende de la tarea, algunas individuales y otras conjuntas"). Sustituye
-- a la columna assigned_to que solo admitía una persona por tarea.
CREATE TABLE task_assignees (
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  PRIMARY KEY (task_id, user_id)
);
CREATE INDEX idx_task_assignees_user ON task_assignees(user_id);
