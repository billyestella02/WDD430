import { Component, Input } from '@angular/core';
import { DocumentsComponent } from './documents/documents.component';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';

  // @Input() selectedFeature: string = 'documents';

  // switchView(selectedFeature: string) {
  //   this.selectedFeature = selectedFeature;
  }

