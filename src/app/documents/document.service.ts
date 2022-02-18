import { Injectable, EventEmitter } from '@angular/core';
import {Document} from "./document.model"
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

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

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.getDocuments;
    this.maxDocumentId = this.getMaxId()
  }

  getDocuments() {
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

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
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

  addDocument(newDocument: Document) {
    if(!newDocument){
      return;
    }
    this.maxDocumentId++
    newDocument.id = this.maxDocumentId.toString()
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    }

    //get position of original document
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id
    this.documents[pos] = newDocument
    let documentsListClone = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
  }

}
