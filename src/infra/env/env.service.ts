import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type Env } from '@/infra/env/env';

@Injectable()
class EnvService {
  private configService: ConfigService<Env, true>;

  constructor(configService: ConfigService<Env, true>) {
    this.configService = configService;
  }

  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}

export { EnvService };
