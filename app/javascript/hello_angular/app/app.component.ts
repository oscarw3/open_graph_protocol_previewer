import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import templateString from './app.component.html';


@Component({
  selector: 'hello-angular',
  template: templateString,
})
export class AppComponent {
  status = 'Not Started';
  constructor(private http: HttpClient){}  

  processImage() {
    console.log("processing...");
    this.http.get('/open_graph_previewer/process_image').subscribe(data => {
      this.status = data['process'];
    });    
  }
}
