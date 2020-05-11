import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import templateString from './previewer.component.html';
import { ActionCableService, Channel } from 'angular2-actioncable';

@Component({
  selector: 'previewer',
  template: templateString,
})
export class PreviewerComponent {
  url = '';
  processing = false;
  previewerForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cableService: ActionCableService,
  ) {
    this.previewerForm = this.formBuilder.group({
      url: '',
    });
  }

  onSubmit() {
  
    const postParams = this.previewerForm.value
    this.url = postParams['url'];

    // Open a connection and obtain a reference to the channel
    const channel: Channel = this.cableService
      .cable('ws://localhost:5000/cable')
      .channel('WebPageMetadataChannel', {"web_page_url": this.url});

    // Subscribe to incoming messages
    const subscription = channel.received().subscribe(metadata => {
        console.log("message received");
        console.log(metadata);
        this.processing = true;
        this.url;
        if (metadata.processing_status == "completed" || metadata.processing_status == "failed") {
          subscription.unsubscribe();
        }
    });

    // Only make the post request to start processing when ws is connected
    channel.connected().subscribe(resp => this.http.post('open_graph_previewer/start_processing', postParams).subscribe());
  }
}
