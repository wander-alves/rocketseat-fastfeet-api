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

import { UpdateRecipientPasswordUseCase } from '@/domain/delivery/application/use-cases/update-recipient-password';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { Roles, Role } from '@/infra/authentication/roles';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

const updateRecipientPasswordBodySchema = z.object({
  password: z.string().min(8).max(22),
  confirmPassword: z.string().min(8).max(22),
});

type UpdateRecipientPasswordBody = z.infer<
  typeof updateRecipientPasswordBodySchema
>;

const validationPipe = new ZodValidationPipe(updateRecipientPasswordBodySchema);

@Controller('/api/accounts/recipients/:id/update-password')
class UpdateRecipientPasswordController {
  private useCase: UpdateRecipientPasswordUseCase;

  constructor(useCase: UpdateRecipientPasswordUseCase) {
    this.useCase = useCase;
  }

  @Put()
  @HttpCode(204)
  @Roles(Role.ADMIN)
  async handle(
    @Body(validationPipe) body: UpdateRecipientPasswordBody,
    @Param('id') recipientId: string,
    @UserTokenDecorator() user: TokenPayload,
  ) {
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) {
      throw new BadRequestException('The provided passwords does not match.');
    }

    const result = await this.useCase.execute({
      logisticsSupportId: user.sub,
      recipientId,
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

export { UpdateRecipientPasswordController };
