import swaggerJsdoc from "swagger-jsdoc";


const swaggerSpec: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FilmHub: API Catálogo de Películas",
      version: "1.0.0",
      description:
        "Documentación API RESTful - Proyecto Backend memoria de practicas: API REST para la gestión de un catálogo de películas, reseñas y foros"
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Servidor local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/modules/**/*.ts"]
};

export const swaggerDocumentation = swaggerJsdoc(swaggerSpec);
