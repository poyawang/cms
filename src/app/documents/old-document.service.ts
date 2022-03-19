import { Injectable, EventEmitter } from '@angular/core';
import {Document} from "./document.model"
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  documentListChangedEvent = new Subject<Document[]>();

  //property for max id
  maxDocumentId: number;

  documents: Document[] = [];

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    // this.getDocuments;
    // this.maxDocumentId = this.getMaxId()
  }

  getDocuments() {
    this.http.get<Document[] >('http://localhost:3000/documents')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (documents: Document[] ) => {
          //assign the array of documents received to the documents class attribute
          this.documents = documents
          this.maxDocumentId = this.getMaxId()
          //sort alphabetically by name
          this.documents.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
          // signal that the list has changed
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.log(error);
        }
    )
    return this.documents.slice()
  }

  getDocument(id:string): Document {
    for (let document of this.documents){
      if(document.id === id){
        return document
      }
    }
    return null;
  }

  // deleteDocument(document: Document) {
  //   if (!document) {
  //     return;
  //   }
  //   const pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.documents.splice(pos, 1);
  //   let documentsListClone = this.documents.slice()
  //   // this.documentListChangedEvent.next(documentsListClone)
  //   this.storeDocuments()
  // }
  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.storeDocuments();
        }
      );
  }



  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // addDocument(newDocument: Document) {
  //   if(!newDocument){
  //     return;
  //   }
  //   this.maxDocumentId++
  //   newDocument.id = this.maxDocumentId.toString()
  //   this.documents.push(newDocument);
  //   let documentsListClone = this.documents.slice()
  //   // this.documentListChangedEvent.next(documentsListClone)
  //   this.storeDocuments()
  // }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
            this.storeDocuments()
        }
      );
  }

  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (!originalDocument || !newDocument) {
  //     return
  //   }

  //   //get position of original document
  //   const pos = this.documents.indexOf(originalDocument);
  //   if (pos < 0) {
  //     return;
  //   }

  //   newDocument.id = originalDocument.id
  //   this.documents[pos] = newDocument
  //   let documentsListClone = this.documents.slice()
  //   // this.documentListChangedEvent.next(documentsListClone)
  //   this.storeDocuments()
  // }
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

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
          this.storeDocuments();
        }
      );
  }

  storeDocuments() {
      //stringify the list of documnts
      let documents = JSON.stringify(this.documents);

      //create header for content type
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      //put method with url, documents object to replace, and headers
      this.http.put('https://cms-project-3d1c1-default-rtdb.firebaseio.com/documents.json', documents, { headers: headers })
        //subscribe to response
        .subscribe(
          () => {
            //once a response has been received, signal that the document list has changed, send copy of list
            this.documentListChangedEvent.next(this.documents.slice());
          }
        )
    }

}


