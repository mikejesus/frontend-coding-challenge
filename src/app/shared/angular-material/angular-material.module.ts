import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import  { MatIconModule} from '@angular/material/icon';
  import {MatListModule} from '@angular/material/list';
 import  {MatInputModule} from '@angular/material/input';
 import { MatFormFieldModule} from '@angular/material/form-field';
  import {MatRadioModule,} from '@angular/material/radio';
  import {MatSlideToggleModule,} from '@angular/material/slide-toggle';
  import {MatSelectModule,} from '@angular/material/select';
  import {MatCardModule,} from '@angular/material/card';
  import {MatGridListModule,} from '@angular/material/grid-list';
  import {MatTabsModule,} from '@angular/material/tabs';
  import {MatExpansionModule,} from '@angular/material/expansion';
  import {MatTableModule,} from '@angular/material/table';
  import {MatPaginatorModule,} from '@angular/material/paginator';
  import {MatSortModule,} from '@angular/material/sort';
  import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
  import {MatDialogModule,} from '@angular/material/dialog';
  import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  exports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class AngularMaterialModule {
}
