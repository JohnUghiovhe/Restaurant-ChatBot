"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const dotenv_1 = require("dotenv");
const app_module_1 = require("./app.module");
(0, dotenv_1.config)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'public'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const basePort = Number(process.env.PORT) || 3000;
    const maxAttempts = Number(process.env.PORT_TRY_COUNT) || 10;
    for (let i = 0; i < maxAttempts; i++) {
        const port = basePort + i;
        try {
            await app.listen(port);
            console.log(`Application is running on: http://localhost:${port}`);
            return;
        }
        catch (err) {
            const code = err?.code;
            if (code === 'EADDRINUSE') {
                continue;
            }
            throw err;
        }
    }
    throw new Error(`Could not start server. Ports ${basePort}-${basePort + maxAttempts - 1} are in use.`);
}
bootstrap();
//# sourceMappingURL=main.js.map