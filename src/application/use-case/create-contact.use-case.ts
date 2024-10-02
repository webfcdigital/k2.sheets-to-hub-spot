import { Contact } from '../../domain/entities/contact.entity';
import { GoogleSheetsService } from '../../infrastructure/services/google-sheets.service';
import { HubSpotService } from '../../infrastructure/services/hubspot.service';
import { ContactRepository } from '../../infrastructure/repositories/contact.repository';

export class CreateContactUseCase {
  constructor(
    private readonly googleSheetsService: GoogleSheetsService,
    private readonly hubSpotService: HubSpotService,
    private readonly contactRepository: ContactRepository
  ) {}

  async execute(): Promise<void> {
    const contacts = await this.googleSheetsService.getContactsFromSheet();

    for (const data of contacts) {
      const contact = new Contact(data.companyName, data.fullName, data.email, data.phone, data.website);

      if (contact.isCorporateEmail()) {
        await this.hubSpotService.addContact(contact);
        await this.contactRepository.saveContact(contact);
      } else {
        console.log(`Email inválido: ${contact.email}`);
      }
    }
  }
}
