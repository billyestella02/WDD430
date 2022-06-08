import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  @Input() contact!: Contact;
  

  constructor(private contactService: ContactService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        let id = params['id'];
        this.contact = this.contactService.getContact(id);
      }
    );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('contacts');
  }
}
