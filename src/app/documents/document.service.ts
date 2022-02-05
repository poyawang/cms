import { Injectable, EventEmitter } from '@angular/core';
import {Document} from "./document.model"
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();

  documents: Document[] = [];

  getDocuments() {
    return this.documents.slice()
  }

  getDocument(id:string) {
    for (let document of this.documents){
      if(document.id == id){
        return document
      } else{
        return null
      }
    }
  }

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }
}
