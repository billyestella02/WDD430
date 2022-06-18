import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];
  maxDocumentId: number;
  
  constructor(private http: HttpClient) { 
    this.documents = [];
    this.maxDocumentId = this.getMaxId();

  }

  getDocuments(): Document[] {
    this.http
      .get<Document[]>('https://wdd430-cms-a4f31-default-rtdb.firebaseio.com/documents.json')
      .subscribe(
        // success
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();

          this.documents.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return 0;
            }
          });
          let documentsClone = [...this.documents];
          this.documentListChangedEvent.next(documentsClone);
        },
        // error
        (error: any) => {
          console.log(error);
        }
      )
    return [...this.documents];
  }

  storeDocuments(documents: Document[]): any {
    let documentsJSON = JSON.stringify(documents);
    const httpHeader = new HttpHeaders().set('content-type', 'application/json');

    this.http
      .put<Document[]>(
        'https://wdd430-cms-a4f31-default-rtdb.firebaseio.com/documents.json', 
        documentsJSON,
        { headers: httpHeader})
      .subscribe(() => {
        let documentsClone = [...this.documents];
        this.documentListChangedEvent.next(documentsClone);
      }, (error: any) => {
        console.log(error);
      }
    );
  }

  getDocument(id: string): Document | null {
    return this.documents.find((document) => document.id === id);
  }

  getMaxId(): number {
    let maxId = 0;
    
    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    console.log(maxId);
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = [...this.documents];
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = [...this.documents];
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(documentsListClone);
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    // this.documentChangedEvent.emit([...this.documents]);
    let documentsListClone = [...this.documents];
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments(documentsListClone);
  }
}
