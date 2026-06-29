// import { faker } from '@faker-js/faker';
// import { Injectable } from '@nestjs/common';

// import {
//   LogisticsSupport,
//   type ILogisticsSupport,
// } from '@/domain/delivery/enterprise/entities/logistics-support';
// import { UniqueEntityID } from '@/core/entities/unique-entity-id';
// import { DocumentID } from '@/domain/delivery/enterprise/entities/value-objects/document-id';

// import { PrismaService } from '@/infra/database/prisma.service';
// import { PrismaLogisticsSupportMapper } from '@/infra/database/prisma/mappers/prisma-logistics-support-mapper';

// function makeLogisticsSupport(
//   override?: Partial<ILogisticsSupport>,
//   id?: string,
// ) {
//   const logisticsSupport = new LogisticsSupport(
//     {
//       name: faker.person.fullName(),
//       documentID: new DocumentID('999.999.999-01'),
//       password: faker.internet.password(),
//       ...override,
//     },
//     new UniqueEntityID(id),
//   );

//   return logisticsSupport;
// }

// @Injectable()
// class LogisticsSupportFactory {
//   private prisma: PrismaService;

//   constructor(prisma: PrismaService) {
//     this.prisma = prisma;
//   }

//   async makePrismaLogisticsSupport(
//     data: Partial<ILogisticsSupport> = {},
//   ): Promise<LogisticsSupport> {
//     const logisticsSupport = makeLogisticsSupport(data);

//     await this.prisma.user.create({
//       data: PrismaLogisticsSupportMapper.toPrisma(logisticsSupport),
//     });

//     return logisticsSupport;
//   }
// }

// export { makeLogisticsSupport, LogisticsSupportFactory };
