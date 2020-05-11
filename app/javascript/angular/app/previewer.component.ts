import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import templateString from './previewer.component.html';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'previewer',
  template: templateString,
})
export class PreviewerComponent {
  imageURL: string | undefined
  processing = false;
  previewerForm: FormGroup;
  processingErrors: string[];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private cableService: ActionCableService,
    private spinnerService: Ng4LoadingSpinnerService
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
          // reset values
          this.imageURL = undefined;
          this.processingErrors = [];

          // start processing, show spinner
          this.processing = true;
          this.spinnerService.show();

          break;
        case "failed":
          console.log("failed");
          // show errors
          this.processingErrors = metadata.errors;
          console.log(this.processingErrors);
          // unsubscribe and stop processing
          this.processing = false;
          this.spinnerService.hide();
          subscription.unsubscribe(); 
          break;
        case "completed":
          console.log("completed");
          // show image
          this.imageURL = metadata.image_url;

          // unsubscribe and stop processing
          this.processing = false;
          this.spinnerService.hide();
          subscription.unsubscribe(); 
          break;
      }
    });
  }

  disableButton(): boolean {
    return this.processing || this.previewerForm.value['url'] == ''
  }
}
