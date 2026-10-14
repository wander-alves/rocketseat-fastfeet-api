import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UnauthorizedException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import type { Express } from 'express';

import { UserTokenDecorator } from '@/infra/authentication/user-token-decorator';
import { type TokenPayload } from '@/infra/authentication/jwt.strategy';

import { UploadDeliveryProofUseCase } from '@/domain/delivery/application/use-cases/upload-delivery-proof';
import { Roles, Role } from '@/infra/authentication/roles';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

const maxFileSize2MB = 1024 * 1024 * 2;
const acceptedFileTypes = '(png|jpg|jpeg|webp)$';

@Controller('/api/shipments/:id/delivery-proof')
class DeliverShipmentController {
  private useCase: UploadDeliveryProofUseCase;

  constructor(useCase: UploadDeliveryProofUseCase) {
    this.useCase = useCase;
  }

  @Post()
  @HttpCode(204)
  @Roles(Role.COURIER)
  async handle(
    @Param('id') shipmentId: string,
    @UserTokenDecorator() user: TokenPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: maxFileSize2MB }),
          new FileTypeValidator({
            fileType: acceptedFileTypes,
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.useCase.execute({
      shipmentId,
      courierId: user.sub,
      fileName: file.filename,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case ResourceNotFoundError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }

    return {
      deliveryProofId: result.value.deliveryProof.id.value,
    };
  }
}

export { DeliverShipmentController };
