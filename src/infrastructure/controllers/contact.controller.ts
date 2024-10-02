import { Controller, Post } from '@nestjs/common';
import { CreateContactUseCase } from '../../application/use-cases/create-contact.use-case';

@Controller('contacts')
export class ContactController {
  constructor(private readonly createContactUseCase: CreateContactUseCase) {}

  @Post('sync')
  async syncContacts() {
    await this.createContactUseCase.execute();
    return { message: 'Contatos sincronizados com sucesso!' };
  }
}
