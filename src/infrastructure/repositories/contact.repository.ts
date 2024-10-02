import { Injectable } from '@nestjs/common';
import { Contact } from '../../domain/entities/contact.entity';
import { MongoClient } from 'mongodb';

@Injectable()
export class ContactRepository {
  private readonly uri = 'mongodb://localhost:27017';
  private readonly dbName = 'contactsDB';
  private readonly collectionName = 'contacts';

  async saveContact(contact: Contact): Promise<void> {
    const client = new MongoClient(this.uri);
    await client.connect();
    const db = client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    await collection.insertOne(contact);
    await client.close();
  }
}
