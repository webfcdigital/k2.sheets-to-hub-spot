import axios from 'axios';
import { Contact } from '../../domain/entities/contact.entity';

export class HubSpotService {
  private readonly apiKey = 'hubspot-api-key';

  async addContact(contact: Contact): Promise<void> {
    const response = await axios.post(`https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${this.apiKey}`, {
      properties: {
        company: contact.companyName,
        email: contact.email,
        phone: contact.phone,
        website: contact.website,
        firstname: contact.fullName,
      },
    });

    if (response.status !== 201) {
      throw new Error('Failed to add contact to HubSpot');
    }
  }
}
