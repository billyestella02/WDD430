import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  
  contacts: Contact[] = [];
  maxContactId: number;
  
  constructor(private http: HttpClient) { 
    this.contacts = [];
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    this.http
    .get<Contact[]>('https://wdd430-cms-a4f31-default-rtdb.firebaseio.com/contacts.json')
    .subscribe(
      // success
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();

        let contactsClone = [...this.contacts];
        this.contactListChangedEvent.next(contactsClone);
      },
      // error
      (error: any) => {
        console.log(error);
      }
    )
    return [...this.contacts];
  }

  storeContacts(contacts: Contact[]): any {
    let contactsJSON = JSON.stringify(contacts);
    const httpHeader = new HttpHeaders().set('content-type', 'application/json');

    this.http
      .put<Contact[]>(
        'https://wdd430-cms-a4f31-default-rtdb.firebaseio.com/contacts.json', 
        contactsJSON,
        { headers: httpHeader})
      .subscribe(() => {
        let contactsClone = [...this.contacts];
        this.contactListChangedEvent.next(contactsClone);
      }, (error: any) => {
        console.log(error);
      }
    );
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id);     
  }

  getMaxId(): number {
    let maxId = 0;

    for (let contact of this.contacts) {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let contactsListClone = [...this.contacts];
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let contactsListClone = [...this.contacts];
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(contactsListClone);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    // this.contactChangedEvent.emit([...this.contacts]);
    let contactsListClone = [...this.contacts];
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts(contactsListClone);
  }
} 

