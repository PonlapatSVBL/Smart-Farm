import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { MainComponent } from './main/main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';

import { MatTabsModule } from '@angular/material/tabs';

import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from 'src/environments/environment';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    ChartsModule,
    MatTabsModule,

    NzProgressModule,
    NzCheckboxModule,
    NzSliderModule,
    NzTreeSelectModule,
    NzTimePickerModule,
    NzSwitchModule,
    NzSelectModule,
    NzRadioModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
