import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    // ...existing components
  ],
  imports: [
    // ...existing modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class AppModule {}