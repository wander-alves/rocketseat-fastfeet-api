import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TokenPayload } from '@/infra/authentication/jwt.strategy';

const UserTokenDecorator = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as TokenPayload;
  },
);

export { UserTokenDecorator };
