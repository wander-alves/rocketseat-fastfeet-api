# Fastfeet API

## Sobre

Esse repositório é a minha resolução do último desafio da trilha de Node.js da [Rocketseat](https://rocketseat.com.br) onde vamos criar um app para gerenciamento de entregas aplicando os conceitos principais do módulo.

---

### Requisitos

**Tasks**

Para registrar no GitHub issues: 

- [ ] Criar os dois tipos de usuário: `admin` e `entregador`
- [ ] Implementar um sistema de login com CPF e Senha
- [ ] Desenvolver o CRUD dos entregadores com acesso restrito a usuários `admin`
- [ ] Desenvolver o CRUD dos destinatários (clientes) com acesso restrito a usuários `admin`
- [ ] Desenvolver o CRUD das encomendas (clientes) com acesso restrito a usuários `admin`
- [ ] Implementar a funcionalidade para alterar a senha de usuários, com acesso restrito a usuário `admin`
- [ ] Implementar a funcionalidade para marcar uma encomenda como "aguardando" (disponível para retirada)
- [ ] Implementar a funcionalidade para um entregador registrar a "retirada" de uma encomenda
- [ ] Implementar a funcionalidade para marcar uma encomenda como "entregue" (restrita ao entregador que a retirou)
- [ ] Implementar a funcionalidade para marcar uma encomenda como "devolvida"
- [ ] Desenvolver a listagem de encomendas com endereços próximos à localização do entregador
- [ ] Desenvolver a listagem das entregas associadas ao entregador
- [ ] Implementar o envio de notificação ao destinatário a cada alteração no status da sua encomenda


**Funcionalidades da aplicação**
- [ ] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [ ] Deve ser possível realizar login com CPF e Senha
- [ ] Deve ser possível realizar o CRUD dos entregadores
- [ ] Deve ser possível realizar o CRUD das encomendas
- [ ] Deve ser possível realizar o CRUD dos destinatários
- [ ] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [ ] Deve ser possível retirar uma encomenda
- [ ] Deve ser possível marcar uma encomenda como entregue
- [ ] Deve ser possível marcar uma encomenda como devolvida
- [ ] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [ ] Deve ser possível alterar a senha de um usuário
- [ ] Deve ser possível listar as entregas de um usuário
- [ ] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

**Regras de negócio**
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [ ] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [ ] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [ ] Somente o admin pode alterar a senha de um usuário
- [ ] Não deve ser possível um entregador listar as encomendas de outro entregador

**Conceitos que pode praticar**
Este desafio foi desenhado para que você possa exercitar e aprofundar seus conhecimentos em:

- Arquitetura e Design: Domain-Driven Design (DDD), Domain Events e Clean Architecture para criar um sistema robusto e escalável
- Segurança: Autenticação e Autorização baseada em papéis (Role-Based Access Control - RBAC) para proteger suas rotas
- Qualidade de Código: Implementação de testes unitários e de ponta a ponta (E2E) para garantir a confiabilidade da API
- Integrações: Simulação de integração com serviços externos (ex: serviço de notificação)


## Tecnologias

- [TypeScript](https://www.typescriptlang.org/play)
- [Vitest](https://vitest.dev/)
- [Faker.js](https://fakerjs.dev/)
- [Nest.js](https://nestjs.com/)
- [Prisma](https://prisma.io)
- [Zod](https://zod.dev/)
- [Passport](https://docs.nestjs.com/recipes/passport)
- [JWT](https://docs.nestjs.com/recipes/passport)
- [BCryptjs](https://www.npmjs.com/package/bcryptjs)
- [Multer](https://docs.nestjs.com/techniques/file-upload)
- [Postgres](https://www.postgresql.org/docs/)
- [Cloudflare R2](https://cloudflare.com/)

