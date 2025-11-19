const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sistema de Parqueadero",
      version: "1.0.0",
      description: "Documentacion api ",
      contact: {
        name: "Juan",
        email: "soporte@parqueadero.com"
      }
    },
    servers: [
      { 
        url: "http://localhost:3000",
        description: "Servidor de desarrollo" 
      }
    ],
    components: {
      schemas: {
        // Esquema para Usuario
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            username: {
              type: "string",
              example: "juanperez"
            },
            email: {
              type: "string",
              example: "juan@email.com"
            },
            password: {
              type: "string",
              example: "password123"
            }
          }
        },
        // Esquema para Vehículo
        Vehiculo: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            placa: {
              type: "string",
              example: "ABC123"
            },
            tipoVehiculo: {
              type: "string",
              enum: ["carro", "moto"],
              example: "carro"
            },
            tipoAcceso: {
              type: "string",
              enum: ["membresia", "dia"],
              example: "membresia"
            },
            horaEntrada: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z"
            },
            horaSalida: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T15:30:00Z"
            },
            ticketPago: {
              type: "string",
              example: "FACTURA-ABC123-1705318200000"
            }
          }
        },
        // Esquema para Membresía
        Membresia: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            tipo: {
              type: "string",
              enum: ["mensual", "semanal", "diaria"],
              example: "mensual"
            },
            fechaInicio: {
              type: "string",
              format: "date",
              example: "2024-01-01"
            },
            fechaFin: {
              type: "string",
              format: "date",
              example: "2024-02-01"
            },
            precio: {
              type: "number",
              example: 150.00
            },
            estado: {
              type: "string",
              enum: ["activa", "inactiva", "expirada"],
              example: "activa"
            }
          }
        },
        // Esquema para Error
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error en la operación"
            },
            error: {
              type: "string",
              example: "ERROR_CODE"
            },
            detalles: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer"
        }
      }
    },
    tags: [
      {
        name: "Usuarios",
        description: "Endpoints para gestión de usuarios y autenticación"
      },
      {
        name: "Activos",
        description: "Endpoints para vehículos activos y gestión de cupos"
      },
      {
        name: "Membresías",
        description: "Endpoints para gestión de membresías"
      },
      {
        name: "Pagos",
        description: "Endpoints para procesamiento de pagos"
      },
      {
        name: "Notificaciones",
        description: "Endpoints para notificaciones y alertas del sistema"
      }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
