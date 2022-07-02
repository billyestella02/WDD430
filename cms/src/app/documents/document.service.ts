import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { max, Subject } from 'rxjs';
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
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {
    this.http
      .get<{message: string, post: Document[]}>('http://localhost:3000/documents')
      .subscribe(
        // success
        (documentData) => {
          this.documents = documentData.post;
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
        'http://localhost:3000/documents',
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

  getMaxId(): number{
    let maxId = 0;

    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    // make sure id of the new Document is empty
    newDocument.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, document: Document }>(
      'http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          this.documents.push(responseData.document);
          //this.sortAndSend();
        }
      );

    // this.maxDocumentId++;
    // newDocument.id = this.maxDocumentId.toString();
    // this.documents.push(newDocument);
    // let documentsListClone = [...this.documents];
    // this.storeDocuments(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
    newDocument, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.documents[pos] = newDocument;
        // this.sortAndSend();
      }
    );

    // newDocument.id = originalDocument.id;
    // this.documents[pos] = newDocument;
    // let documentsListClone = [...this.documents];
    // this.storeDocuments(documentsListClone);
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

     // delete from database
     this.http.delete('http://localhost:3000/documents/' + document.id)
     .subscribe(
       (response: Response) => {
         this.documents.splice(pos, 1);
         // this.sortAndSend();
       }
     );

    // this.documents.splice(pos, 1);
    // let documentsListClone = [...this.documents];
    // this.storeDocuments(documentsListClone);
  }
}
