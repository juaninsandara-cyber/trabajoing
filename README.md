FASTPARK UNI - Sistema de Gestión de Parqueadero
---Descripción
Sistema backend para la gestión digital de parqueaderos universitarios. Desarrollado con Node.js, Express y MySQL, permite el control de ingresos, salidas, membresías y generación de facturas en tiempo real.

---- Características Principales
 Autenticación y Usuarios
Registro y login de usuarios

-Roles de usuario (admin, user, empleado)

Gestión de perfiles y permisos

 - Gestión de Parqueadero
Registro de ingresos y salidas de vehículos

Control de cupos por tipo de vehículo (carro/moto)

Sistema de membresías y acceso por día

Validación de datos en tiempo real

---Dashboard y Reportes
Visualización de vehículos activos en el parqueadero

Control de cupos disponibles

Generación automática de facturas

Historial de movimientos del día

--Calidad del Código
Arquitectura MVC bien definida

Pruebas unitarias e integración con Jest

ORM Sequelize para gestión de base de datos

Validación de datos y manejo de errores
----Arquitectura del Proyecto---
proyecto_par/
├── config/                 # Configuración de base de datos
│   ├── database.js           # Conexión Sequelize
│   └── config.js             # Configuración para migraciones
├── controllers/            # Lógica de negocio
│   ├── userController.js     # Gestión de usuarios
│   ├── ingresoController.js  # Control de ingresos/salidas
│   ├── membresiaController.js # Sistema de membresías
│   └── activosController.js  # Dashboard y reportes
├── models/                # Modelos de base de datos
│   ├── user.js              # Modelo Usuario
│   ├── ingreso.js           # Modelo Registro de movimientos
│   ├── membresia.js         # Modelo Membresías
│   └── index.js             # Relaciones y exportación
├── routes/                # Definición de rutas API
│   ├── users.js             # Rutas de usuarios
│   ├── membresias.js        # Rutas de membresías
│   └── activos.js           # Rutas del dashboard
├── tests/                # Suite de pruebas
│   ├── user.test.js         # Pruebas de usuarios
│   └── basic.test.js        # Pruebas básicas del sistema
├── 📄 app.js               # Configuración principal de Express
├── 📄 package.json         # Dependencias y scripts
├── 📄 .env                 # Variables de entorno
└── 📄 README.md           # Documentación

----Tecnologías Utilizadas-----

Backend: Node.js, Express.js
Base de Datos: MySQL + Sequelize ORM
Autenticación: JWT (JSON Web Tokens)
Pruebas: Jest + Supertest
Variables de Entorno: dotenv
Control de Versiones: GitHub

-----Instalación y Configuración---
Requisitos
Node.js (v16 o superior)
MySQL Server 8.0+
npm 
----Clonar el Repositorio( git clone)
----Instalar dependencias (npm install)
----Crear base de datos en MySQL (CREATE DATABASE parqueadero_db;)
----Ejecutar programa( npm start)
----Para las pruebas( npm test)
------- Pruebas con el postman --------
-- Registro --
POST /users/registro
{
  "username": "usuario123",
  "password": "contraseñaSegura",
  "email": "usuario123@email.com"
}
-- Login --
POST /users/login
{
  "username": "usuario123", 
  "password": "contraseñaSegura"
}
-- ingreso --
POST /users/ingreso
{
  "username": "usuario123",
  "password": "contraseñaSegura", 
  "placa": "ABC123",
  "tipoVehiculo": "carro",
  "tipoAcceso": "día"
}
-- Salida --
POST /users/salida
{
  "username": "usuario123",
  "password": "contraseñaSegura",
  "placa": "ABC123"
}
-- Membresias --
POST /membresias/crear
{
  "username": "usuario123",
  "password": "contraseñaSegura",
  "tipo": "mensual",
  "duracion": 1
}



  




