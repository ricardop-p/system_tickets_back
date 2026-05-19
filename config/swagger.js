// config/swagger.js

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sistema de Tickets",
      version: "1.0.0",
      description: "Documentación de la API del sistema de tickets",
    },
    servers: [
      {
        url: "/",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  // IMPORTANTE:
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Ruta útil para revisar si Swagger está leyendo algo
  app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
  });
}
