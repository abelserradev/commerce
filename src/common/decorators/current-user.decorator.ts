import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtMerchantPayload } from '../types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtMerchantPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtMerchantPayload }>();
    return request.user;
  },
);
