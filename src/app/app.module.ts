import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

@NgModule({
  imports:      [
      BrowserModule,
      RouterModule
  ],
  declarations: [
      AppComponent,
      ColorPickerComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
