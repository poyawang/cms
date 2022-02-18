import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from "../document.service";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  subscription: Subscription;

  documents: Document[] = [];

  constructor(private documentService: DocumentService ) {}

  ngOnInit(): void {

    this.subscription = this.documentService.documentListChangedEvent.subscribe(
      (documentsList: Document[]) => {
        this.documents = documentsList;
      }
    )
    this.documents = this.documentService.getDocuments();

  }

  onSelected(document: Document ){
    this.documentService.documentSelectedEvent.emit(document);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
