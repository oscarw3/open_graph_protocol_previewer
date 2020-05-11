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
  image_url: string | undefined
  processing = false;
  previewerForm: FormGroup;
  processing_errors: string[];

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
    const url = postParams['url'];

    // Open a connection and obtain a reference to the channel
    const channel: Channel = this.cableService
      .cable('ws://localhost:5000/cable')
      .channel('WebPageMetadataChannel', {"web_page_url": url});

    // Subscribe to incoming messages
    this.createChannelSubscription(channel);

    // Only make the post request to start processing when ws is connected
    channel.connected().subscribe(resp => this.http.post('open_graph_previewer/start_processing', postParams).subscribe());
  }

  createChannelSubscription(channel: Channel) {
    const subscription = channel.received().subscribe(metadata => {
      console.log("message received");
      console.log(metadata);
      switch (metadata.processing_status) {
        case "in_progress":
          console.log("in_progress");
          this.processing = true;
          break;
        case "failed":
          console.log("failed");
          // stop processing
          this.processing = false;
          // show errors
          this.processing_errors = metadata.errors; 
          // unsubscribe subscription
          subscription.unsubscribe(); 
          break;
        case "completed":
          console.log("completed");
          // stop processing
          this.processing = false;
          // show image
          this.image_url = metadata.image_url;
          // unsubscribe subscription
          subscription.unsubscribe(); 
          break;
      }
    });
  }

  disableButton(): boolean {
    return this.processing || this.previewerForm.value['url'] == ''
  }
}
