"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_path_1 = __importDefault(require("node:path"));
const config_1 = require("prisma/config");
const databaseUrl = process.env.DATABASE_URL?.trim() ||
    'postgresql://ci:ci@127.0.0.1:5432/commerce_ci';
exports.default = (0, config_1.defineConfig)({
    schema: node_path_1.default.join('prisma', 'schema.prisma'),
    migrations: {
        path: node_path_1.default.join('prisma', 'migrations'),
    },
    datasource: {
        url: databaseUrl,
    },
});
//# sourceMappingURL=prisma.config.js.map