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
    .get<{contacts: Contact[], message: string}>('http://localhost:3000/contacts')
    .subscribe(
      // success
      (contactsData) => {
        this.contacts = contactsData.contacts;
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
        'http://localhost:3000/contacts',
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

    newContact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>(
      'http://localhost:3000/contacts',
      newContact,
      {headers: headers})
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          // this.sortAndSend();
        }
      );


    // this.maxContactId++;
    // newContact.id = this.maxContactId.toString();
    // this.contacts.push(newContact);
    // let contactsListClone = [...this.contacts];
    // this.storeContacts(contactsListClone);
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

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        // this.sortAndSend();
      }
    );

    // this.contacts.splice(pos, 1);
    // // this.contactChangedEvent.emit([...this.contacts]);
    // let contactsListClone = [...this.contacts];
    // // this.contactListChangedEvent.next(contactsListClone);
    // this.storeContacts(contactsListClone);
  }
}

