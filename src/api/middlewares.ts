import type { MiddlewaresConfig } from "@medusajs/medusa"
const { preCartCreation } = require(
    "medusa-plugin-ip-lookup/api/medusa-middleware"
).default

export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: "/store/*",
            middlewares: [preCartCreation],
        },
    ],
}
