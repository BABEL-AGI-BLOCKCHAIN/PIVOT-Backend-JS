import swaggerDocument from "./swagger-output.json" with {"type": "json"};
import swaggerUi from "swagger-ui-express";

const setupSwagger = (app) => {
  if (process.env.NODE_ENV !== "production") {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log("Swagger Docs available at http://localhost:5000/api-docs");
  }
};

export default setupSwagger;
