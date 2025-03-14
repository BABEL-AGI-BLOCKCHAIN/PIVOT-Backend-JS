import swaggerAutogen from "swagger-autogen";
const doc = {
  info: {
    title: "My API",
    description: "API documentation",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/auth.route.js", "../routes/topic.route.js"];

swaggerAutogen(outputFile, endpointsFiles);
