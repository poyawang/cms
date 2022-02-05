import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Document } from '../document.model';
import { DocumentService } from "../document.service";
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  documents: Document[] = [
    // new Document('1', 'test1', 'this is test1', 'test1', null),
    // new Document('2', 'test2', 'this is test2', 'test2', null),
    // new Document('3', 'test3', 'this is test3', 'test3', null),
    // new Document('4', 'test4', 'this is test4', 'test4', null),
    // new Document('5', 'test5', 'this is test5', 'test5', null),

  ];

  constructor(private documentService: DocumentService ) {}

  ngOnInit(){
    this.documents = this.documentService.getDocuments();
  }

  onSelected(document: Document ){
    this.documentService.documentSelectedEvent.emit(document);
  }
}
