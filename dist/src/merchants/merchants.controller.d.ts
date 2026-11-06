import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
import { MerchantsService } from './merchants.service';
export declare class MerchantsController {
    private readonly merchants;
    constructor(merchants: MerchantsService);
    getMe(user: JwtMerchantPayload): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        ownerId: string;
    }>;
}
