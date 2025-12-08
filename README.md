# Codefend Leaks

> **Data Breach Detection & Intelligence Platform**
> Specialized version focused on leak detection through SNS and INX modules

## Descripción

**Codefend Leaks** es una plataforma especializada en la detección y monitoreo de filtraciones de datos (data leaks). A diferencia de la plataforma completa Codefend, esta versión se centra exclusivamente en:

- 🔍 **SNS (Social Network Security)**: Detección de filtraciones de datos, búsqueda de credenciales expuestas y monitoreo de bases de datos de brechas
- 🕵️ **INX (Intelligence Search)**: Monitoreo de dark web, inteligencia de amenazas y análisis integral de filtraciones

Esta aplicación híbrida web/desktop está construida con React + Tauri para ofrecer máximo rendimiento y flexibilidad.

## Requisitos Previos

- Node.js versión 22+ (usar nvm si necesitas cambiar de versión)
- NPM o PNPM para instalar paquetes (se recomienda PNPM)
- Crear un archivo `.env` en el proyecto con el contenido de `example.env`

## Instalación y Ejecución

### Clonar el Repositorio

```bash
git clone https://github.com/codefen/codefend-leaks
cd codefend-leaks
```

### Instalar Dependencias

```bash
npm install
# o con pnpm
pnpm install
```

### Ejecutar en Modo Desarrollo

```bash
npm start
# o
npm run dev
```

### Build para Producción

**Web:**
```bash
npm run build
```

**Desktop (Tauri):**
```bash
npm run tauri build
```

## Características Principales

### 🔐 SNS Module (Social Network Security)
- Búsqueda en bases de datos de brechas masivas
- Detección de credenciales expuestas (emails, contraseñas, usernames)
- Historial de búsquedas anteriores
- Estadísticas de filtraciones detectadas

### 🌐 INX Module (Intelligence Search)
- Monitoreo de dark web y foros
- Búsqueda avanzada de datos filtrados
- Inteligencia de amenazas en tiempo real
- Análisis profundo de fuentes de brechas

### 📊 Dashboard & Analytics
- Métricas de filtraciones detectadas
- Seguimiento de créditos de búsqueda
- Actividad reciente
- Acciones rápidas

## :file_folder: Estructura del Proyecto

```shell
codefend-leaks/
├── .github/                  # GitHub workflows
├── .husky/                   # Git hooks
├── public/                   # Assets públicos
├── src/
│   ├── app/
│   │   ├── constants/        # Constantes y textos globales
│   │   ├── data/             # Capa de datos (lógica de negocio)
│   │   │   ├── services/     # Comunicación con API
│   │   │   ├── hooks/        # Custom hooks
│   │   │   │   ├── modules/
│   │   │   │   │   ├── sns/  # 🔍 Hooks de SNS module
│   │   │   │   │   └── inx/  # 🕵️ Hooks de INX module
│   │   │   ├── interfaces/   # TypeScript types
│   │   │   └── utils/        # Funciones utilitarias
│   │   ├── router/           # React Router config
│   │   └── views/            # Capa UI
│   │       ├── components/   # Componentes reutilizables
│   │       ├── pages/        # Páginas
│   │       │   └── panel/layouts/
│   │       │       ├── sns/      # 🔍 SNS UI
│   │       │       └── dashboard/
│   │       ├── contexts/     # React Context providers
│   │       └── styles/       # Estilos globales
│   └── editor-lib/           # TinyMCE utils
├── src-tauri/                # Código Rust (desktop)
├── ARCHITECTURE.md           # 📖 Documentación de arquitectura
├── package.json
└── tsconfig.json
```

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción (web)
npm run tauri dev    # Desarrollo modo desktop
npm run tauri build  # Build desktop (Windows/Mac/Linux)
npm run lint:fix     # Corregir errores de ESLint
npm run format:fix   # Formatear código con Prettier
npm run types:check  # Verificar tipos TypeScript
npm run checking     # Ejecutar todos los checks
```

## Tecnologías

- **Frontend**: React 19, TypeScript 5.8
- **Build Tool**: Vite 7
- **Desktop**: Tauri 2.8
- **Routing**: React Router 7
- **State**: React Context + SWR
- **Styling**: SCSS Modules
- **Charts**: Chart.js, D3.js

## Documentación

Para más información sobre la arquitectura y patrones de desarrollo, consulta:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentación completa de arquitectura
- [Codefend Platform Docs](https://docs.codefend.com)

## Diferencias con Codefend Platform

**Codefend Leaks** es una versión enfocada que **NO incluye**:
- ❌ ENP (External Network Penetration)
- ❌ VDB (Vulnerability Database)
- ❌ Gestión de recursos (Web, Mobile, Network, Social)
- ❌ Tracking de issues/vulnerabilidades
- ❌ Gestión completa de superficie de ataque

**Solo incluye**:
- ✅ SNS (Social Network Security)
- ✅ INX (Intelligence Search)
- ✅ Dashboard básico
- ✅ Sistema de autenticación
- ✅ Gestión de usuarios

## Licencia

Copyright © Codefend

---

**Versión**: 25.1.0
**Última actualización**: Octubre 2025
