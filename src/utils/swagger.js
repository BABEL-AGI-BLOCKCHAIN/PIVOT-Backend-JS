import swaggerAutogen from "swagger-autogen";
const doc = {
  info: {
    title: "My API",
    description: "API documentation",
  },
  host: "localhost:5000",
  basePath: "/",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
