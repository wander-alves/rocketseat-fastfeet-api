import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';

import { EnvService } from '@/infra/env/env.service';

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
});

type TokenPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    const base64PublKey = envService.get('JWT_PUBL_KEY');
    const publicKey = Buffer.from(base64PublKey, 'base64');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  validate(payload: TokenPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}

export { JwtStrategy, type TokenPayload };
