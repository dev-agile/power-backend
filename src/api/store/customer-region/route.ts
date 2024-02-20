import type {
    MedusaRequest,
    MedusaResponse,
    RegionService,
} from "@medusajs/medusa"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ipLookupService = req.scope.resolve(
        "ipLookupService"
    )
    const regionService = req.scope.resolve<RegionService>(
        "regionService"
    )

    const ip = req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress

    const { data } = await ipLookupService.lookupIp(ip)

    if (!data.country_code) {
        throw new Error ("Couldn't detect country code.")
    }

    const region = await regionService
        .retrieveByCountryCode(data.country_code)

    res.json({
        region,
    })
}
