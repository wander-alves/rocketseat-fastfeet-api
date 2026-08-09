import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

import { UpdateCourierPasswordUseCase } from '@/domain/delivery/application/use-cases/update-courier-password';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Roles, Role } from '@/infra/authentication/roles';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

const updateCourierPasswordBodySchema = z.object({
  password: z.string().min(8).max(22),
  confirmPassword: z.string().min(8).max(22),
});

type UpdateCourierPasswordBody = z.infer<
  typeof updateCourierPasswordBodySchema
>;

const validationPipe = new ZodValidationPipe(updateCourierPasswordBodySchema);

@Controller('/api/accounts/couriers/:id/update-password')
class UpdateCourierPasswordController {
  private useCase: UpdateCourierPasswordUseCase;

  constructor(useCase: UpdateCourierPasswordUseCase) {
    this.useCase = useCase;
  }

  @Put()
  @HttpCode(204)
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: UpdateCourierPasswordBody,
    @Param('id') courierId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('The provided passwords does not match.');
    }

    const result = await this.useCase.execute({
      logisticsSupportId: user.sub,
      courierId,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}

export { UpdateCourierPasswordController };
