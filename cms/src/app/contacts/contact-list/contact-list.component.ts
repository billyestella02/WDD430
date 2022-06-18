import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  
  contacts: Contact[] =[];
  subscription: Subscription;
  term: string = '';

  constructor(public contactService: ContactService) { }

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();

    this.contactService.contactChangedEvent
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
        }
      );

    this.subscription = this.contactService.contactListChangedEvent
      .subscribe(
        (contactsList: Contact[]) => {
          this.contacts = contactsList;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(value: string) {
    this.term = value;
    console.log(this.term);
  }
}
