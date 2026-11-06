import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { JwtMerchantPayload } from '../common/types/jwt-payload.type';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtMerchantPayload): JwtMerchantPayload;
}
export {};
