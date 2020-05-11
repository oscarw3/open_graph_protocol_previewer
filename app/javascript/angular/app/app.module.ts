import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { PreviewerComponent } from './previewer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionCableService } from 'angular2-actioncable';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  declarations: [
    PreviewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [ActionCableService],
  bootstrap: [PreviewerComponent]
})
export class AppModule { }
