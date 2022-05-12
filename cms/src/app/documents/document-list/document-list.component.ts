import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';
@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    {
      id: '1',
      name: 'doc1',
      description: 'description1',
      url: 'url1.com',
      children: null
    },
    {
      id: '2',
      name: 'doc2',
      description: 'description2',
      url: 'url2.com',
      children: null
    },
    {
      id: '3',
      name: 'doc3',
      description: 'description3',
      url: 'url3.com',
      children: null
    },
    {
      id: '4',
      name: 'doc4',
      description: 'description4',
      url: 'url4.com',
      children: null
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
