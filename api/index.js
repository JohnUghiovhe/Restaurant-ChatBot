"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const app_module_1 = require("../src/app.module");
(0, dotenv_1.config)();
let cachedServer = null;
async function getServer() {
    if (cachedServer)
        return cachedServer;
    const server = (0, express_1.default)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
        logger: ['error', 'warn', 'log'],
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'));
    app.setBaseViewsDir((0, path_1.join)(process.cwd(), 'public'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    await app.init();
    cachedServer = server;
    return server;
}
async function handler(req, res) {
    const server = await getServer();
    return server(req, res);
}
//# sourceMappingURL=index.js.map