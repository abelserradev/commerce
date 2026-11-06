"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:4200';
    app.enableCors({ origin: [frontendUrl, 'http://localhost:4200'], credentials: true });
    const port = Number(process.env.PORT ?? 3090);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map