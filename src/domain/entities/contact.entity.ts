export class Contact {
    constructor(
      public companyName: string,
      public fullName: string,
      public email: string,
      public phone: string,
      public website: string,
    ) {}
  
    public isCorporateEmail(): boolean {
      const emailDomain = this.email.split('@')[1];
      return emailDomain && !emailDomain.includes('gmail.com') && !emailDomain.includes('yahoo.com');
    }
  }
  