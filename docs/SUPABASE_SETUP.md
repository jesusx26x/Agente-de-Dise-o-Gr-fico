# 🗄️ Guía: Configuración de Supabase

## Paso 1: Crear Cuenta en Supabase (5 minutos)

1. Ve a **[supabase.com](https://supabase.com)**
2. Haz clic en **"Start your project"**
3. Inicia sesión con GitHub (más fácil)
4. Crea una nueva organización si es la primera vez

---

## Paso 2: Crear Proyecto (2 minutos)

1. Clic en **"New Project"**
2. Llena los campos:
   - **Name**: `marketing-ai-platform`
   - **Database Password**: (genera una segura y guárdala)
   - **Region**: Selecciona la más cercana a ti (ej: `South America - São Paulo`)
3. Clic en **"Create new project"**
4. Espera ~2 minutos mientras se crea

---

## Paso 3: Obtener Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** (⚙️ engranaje) → **API**
2. Copia estos valores:

| Campo | Dónde encontrarlo |
|-------|-------------------|
| **Project URL** | Primer campo, ej: `https://xxxx.supabase.co` |
| **anon public** key | En "Project API keys" |
| **service_role** key | En "Project API keys" (¡mantener secreto!) |

---

## Paso 4: Ejecutar SQL de Tablas

1. Ve a **SQL Editor** (icono de base de datos) en el menú izquierdo
2. Clic en **"New query"**
3. Copia y pega el contenido del archivo `supabase_schema.sql` que creé en tu proyecto
4. Clic en **"Run"** (o Ctrl+Enter)

---

## Paso 5: Actualizar tu .env

Abre `backend/.env` y actualiza:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui
```

---

## ✅ Verificación

Para verificar que todo funciona:
1. Ve a **Table Editor** en Supabase
2. Deberías ver las tablas: `brands`, `generated_content`, `users`
