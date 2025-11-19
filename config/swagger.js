const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sistema de Parqueadero",
      version: "1.0.0",
      description: "Documentación completa de la API del Sistema de Parqueadero",
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
              example: "2025-01-15T10:30:00Z"
            },
            horaSalida: {
              type: "string",
              format: "date-time",
              example: "2025-01-15T15:30:00Z"
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
              example: "2025-01-01"
            },
            fechaFin: {
              type: "string",
              format: "date",
              example: "2025-02-01"
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
    ],
    paths: {
      "/users/registro": {
        post: {
          tags: ["Usuarios"],
          summary: "Registrar nuevo usuario",
          description: "Crea una nueva cuenta de usuario en el sistema",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
                    },
                    email: {
                      type: "string",
                      example: "testuser@email.com"
                    }
                  },
                  required: ["username", "password", "email"]
                }
              }
            }
          },
          responses: {
            201: {
              description: "Usuario registrado exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Usuario registrado exitosamente" },
                      userId: { type: "integer", example: 1 }
                    }
                  }
                }
              }
            },
            400: {
              description: "Error en los datos de entrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/users/login": {
        post: {
          tags: ["Usuarios"],
          summary: "Iniciar sesión",
          description: "Autentica un usuario y devuelve un token de acceso",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "usuario223"
                    },
                    password: {
                      type: "string",
                      example: "holiss"
                    }
                  },
                  required: ["username", "password"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login exitoso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Login exitoso" },
                      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                      user: { $ref: "#/components/schemas/Usuario" }
                    }
                  }
                }
              }
            },
            401: {
              description: "Credenciales inválidas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/users/ingreso": {
        post: {
          tags: ["Usuarios"],
          summary: "Registrar ingreso de vehículo",
          description: "Registra el ingreso de un vehículo al parqueadero",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
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
                      enum: ["membresía", "día"],
                      example: "día"
                    }
                  },
                  required: ["username", "password", "placa", "tipoVehiculo", "tipoAcceso"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Ingreso registrado exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Ingreso registrado exitosamente" },
                      ticket: { type: "string", example: "TICKET-ABC123-1705318200000" },
                      horaEntrada: { type: "string", format: "date-time" }
                    }
                  }
                }
              }
            },
            400: {
              description: "Error en el registro de ingreso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/users/salida": {
        post: {
          tags: ["Usuarios"],
          summary: "Registrar salida de vehículo",
          description: "Registra la salida de un vehículo y calcula el pago",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
                    },
                    placa: {
                      type: "string",
                      example: "ABC123"
                    }
                  },
                  required: ["username", "password", "placa"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Salida registrada exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Salida registrada exitosamente" },
                      totalPagar: { type: "number", example: 15.50 },
                      tiempoEstancia: { type: "string", example: "2 horas 30 minutos" },
                      factura: { type: "string", example: "FACTURA-ABC123-1705318200000" }
                    }
                  }
                }
              }
            },
            400: {
              description: "Error en el registro de salida",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/membresias/crear": {
        post: {
          tags: ["Membresías"],
          summary: "Crear nueva membresía",
          description: "Crea una nueva membresía para un usuario",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
                    },
                    tipo: {
                      type: "string",
                      enum: ["mensual", "semanal", "diaria"],
                      example: "mensual"
                    },
                    duracion: {
                      type: "integer",
                      example: 1
                    }
                  },
                  required: ["username", "password", "tipo", "duracion"]
                }
              }
            }
          },
          responses: {
            201: {
              description: "Membresía creada exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Membresía creada exitosamente" },
                      membresia: { $ref: "#/components/schemas/Membresia" },
                      totalPagar: { type: "number", example: 150.00 }
                    }
                  }
                }
              }
            },
            400: {
              description: "Error al crear membresía",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/membresias/verificar": {
        post: {
          tags: ["Membresías"],
          summary: "Verificar estado de membresía",
          description: "Verifica el estado y validez de la membresía de un usuario",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
                    }
                  },
                  required: ["username", "password"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Estado de membresía obtenido",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      tieneMembresia: { type: "boolean", example: true },
                      membresia: { $ref: "#/components/schemas/Membresia" },
                      estado: { type: "string", example: "activa" }
                    }
                  }
                }
              }
            },
            404: {
              description: "No se encontró membresía",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/membresias/renovar": {
        post: {
          tags: ["Membresías"],
          summary: "Renovar membresía",
          description: "Renueva una membresía existente para un usuario",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
                    },
                    tipo: {
                      type: "string",
                      enum: ["mensual", "semanal", "diaria"],
                      example: "mensual"
                    },
                    duracion: {
                      type: "integer",
                      example: 1
                    }
                  },
                  required: ["username", "password", "tipo", "duracion"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Membresía renovada exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Membresía renovada exitosamente" },
                      membresia: { $ref: "#/components/schemas/Membresia" },
                      totalPagar: { type: "number", example: 150.00 }
                    }
                  }
                }
              }
            },
            400: {
              description: "Error al renovar membresía",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/payments/membresia": {
        post: {
          tags: ["Pagos"],
          summary: "Pagar membresía",
          description: "Procesa el pago de una membresía",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: {
                      type: "string",
                      example: "testuser"
                    },
                    password: {
                      type: "string",
                      example: "123456"
                    },
                    tipoMembresia: {
                      type: "string",
                      example: "mensual"
                    },
                    metodoPago: {
                      type: "string",
                      example: "tarjeta"
                    },
                    monto: {
                      type: "number",
                      example: 150.00
                    }
                  },
                  required: ["username", "password", "tipoMembresia", "metodoPago", "monto"]
                }
              }
            }
          },
          responses: {
            200: {
              description: "Pago procesado exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Pago procesado exitosamente" },
                      transaccionId: { type: "string", example: "TRX-123456" },
                      estado: { type: "string", example: "completado" }
                    }
                  }
                }
              }
            },
            400: {
              description: "Error en el pago",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/activos/vehiculos-activos": {
        get: {
          tags: ["Activos"],
          summary: "Obtener vehículos activos",
          description: "Retorna la lista de vehículos actualmente en el parqueadero",
          responses: {
            200: {
              description: "Lista de vehículos activos obtenida exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      vehiculos: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Vehiculo" }
                      },
                      total: { type: "integer", example: 5 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/activos/cupos-disponibles": {
        get: {
          tags: ["Activos"],
          summary: "Obtener cupos disponibles",
          description: "Retorna la cantidad de cupos disponibles por tipo de vehículo",
          responses: {
            200: {
              description: "Cupos disponibles obtenidos exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      cuposCarros: { type: "integer", example: 15 },
                      cuposMotos: { type: "integer", example: 10 },
                      totalDisponible: { type: "integer", example: 25 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/activos/historial-hoy": {
        get: {
          tags: ["Activos"],
          summary: "Obtener historial del día",
          description: "Retorna el historial de ingresos y salidas del día actual",
          responses: {
            200: {
              description: "Historial del día obtenido exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      historial: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            placa: { type: "string", example: "ABC123" },
                            tipoVehiculo: { type: "string", example: "carro" },
                            horaEntrada: { type: "string", format: "date-time" },
                            horaSalida: { type: "string", format: "date-time" },
                            totalPagado: { type: "number", example: 15.50 }
                          }
                        }
                      },
                      totalRegistros: { type: "integer", example: 20 }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/notificaciones/verificar-ocupacion": {
        get: {
          tags: ["Notificaciones"],
          summary: "Verificar ocupación",
          description: "Verifica el nivel de ocupación del parqueadero y envía notificaciones si es necesario",
          responses: {
            200: {
              description: "Verificación completada",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Verificación de ocupación completada" },
                      ocupacion: { type: "number", example: 75 },
                      estado: { type: "string", example: "normal" },
                      notificacionesEnviadas: { type: "boolean", example: false }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/notificaciones/estado-parqueadero": {
        get: {
          tags: ["Notificaciones"],
          summary: "Obtener estado del parqueadero",
          description: "Retorna el estado actual del parqueadero",
          responses: {
            200: {
              description: "Estado del parqueadero obtenido exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalCupos: { type: "integer", example: 50 },
                      cuposOcupados: { type: "integer", example: 35 },
                      cuposDisponibles: { type: "integer", example: 15 },
                      porcentajeOcupacion: { type: "number", example: 70 },
                      estado: { type: "string", example: "moderado" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/notificaciones/prueba-correo": {
        get: {
          tags: ["Notificaciones"],
          summary: "Prueba de envío de correo",
          description: "Endpoint para probar el envío de correos electrónicos",
          responses: {
            200: {
              description: "Correo de prueba enviado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Correo de prueba enviado exitosamente" },
                      destinatario: { type: "string", example: "admin@parqueadero.com" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };