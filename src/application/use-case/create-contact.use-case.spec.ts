import { CreateContactUseCase } from './create-contact.use-case';
import { GoogleSheetsService } from '../../infrastructure/services/google-sheets.service';
import { HubSpotService } from '../../infrastructure/services/hubspot.service';
import { ContactRepository } from '../../infrastructure/repositories/contact.repository';

describe('CreateContactUseCase', () => {
  let createContactUseCase: CreateContactUseCase;
  let googleSheetsService: GoogleSheetsService;
  let hubSpotService: HubSpotService;
  let contactRepository: ContactRepository;

  beforeEach(() => {
    googleSheetsService = new GoogleSheetsService();
    hubSpotService = new HubSpotService();
    contactRepository = new ContactRepository();
    createContactUseCase = new CreateContactUseCase(googleSheetsService, hubSpotService, contactRepository);
  });

  it('deve salvar e sincronizar contatos com email corporativo', async () => {
    jest.spyOn(googleSheetsService, 'getContactsFromSheet').mockResolvedValue([
      { companyName: 'Empresa XYZ', fullName: 'Fulano de Tal', email: 'fulano@empresa.com', phone: '123456789', website: 'www.empresa.com' }
    ]);
    const hubSpotSpy = jest.spyOn(hubSpotService, 'addContact').mockResolvedValue(undefined);
    const repoSpy = jest.spyOn(contactRepository, 'saveContact').mockResolvedValue(undefined);

    await createContactUseCase.execute();

    expect(hubSpotSpy).toHaveBeenCalled();
    expect(repoSpy).toHaveBeenCalled();
  });
});

it('não deve sincronizar contatos com email pessoal', async () => {
    jest.spyOn(googleSheetsService, 'getContactsFromSheet').mockResolvedValue([
      { companyName: 'Empresa ABC', fullName: 'Beltrano da Silva', email: 'beltrano@gmail.com', phone: '987654321', website: 'www.empresaabc.com' }
    ]);
    const hubSpotSpy = jest.spyOn(hubSpotService, 'addContact').mockResolvedValue(undefined);
    const repoSpy = jest.spyOn(contactRepository, 'saveContact').mockResolvedValue(undefined);
  
    await createContactUseCase.execute();
  
    expect(hubSpotSpy).not.toHaveBeenCalled();
    expect(repoSpy).not.toHaveBeenCalled();
  });
  
  it('deve lançar exceção quando HubSpot falha', async () => {
    jest.spyOn(googleSheetsService, 'getContactsFromSheet').mockResolvedValue([
      { companyName: 'Empresa XYZ', fullName: 'Fulano de Tal', email: 'fulano@empresa.com', phone: '123456789', website: 'www.empresa.com' }
    ]);
    jest.spyOn(hubSpotService, 'addContact').mockRejectedValue(new Error('HubSpot error'));
  
    await expect(createContactUseCase.execute()).rejects.toThrow('HubSpot error');
  });
  