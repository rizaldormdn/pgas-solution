import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("PGAS Solution API")
    .setVersion("1.0")
    .addTag("Authentication", "Register and Login endpoints")
    .addTag("Departments", "Department CRUD operations")
    .addTag("Employees", "Employee CRUD operations")
    .addTag("Spendings", "Spending reports and exports")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter your JWT token",
        in: "header",
      },
      "JWT-auth",
    )
    .addSecurityRequirements("JWT-auth")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      operationsSorter: "method",
      tagsSorter: "alpha",
      tryItOutEnabled: true,
      filter: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .scheme-container { background: #f8f9fa }
    `,
    customSiteTitle: "PGAS Solution API Documentation",
  });

  await app.listen(3000);
  console.log(`
  🚀 Application is running on: http://localhost:3000
  📚 Swagger Documentation: http://localhost:3000/api/docs
  `);
}
bootstrap();
