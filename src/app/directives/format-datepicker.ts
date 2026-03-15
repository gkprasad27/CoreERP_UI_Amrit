import { NativeDateAdapter, MatDateFormats } from '@angular/material/core';
import { Injectable, ElementRef, Input, Directive, HostListener } from "@angular/core";
import { formatDate } from '@angular/common';

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd-MM-yyyy', this.locale);;
    } else {
      return date.toDateString();
    }
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: {
      year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};


@Directive({
  selector: '[nonEditable]'
})
export class NonEditableDatepicker {

  @Input('nonEditable') datePickerRef: any;

  constructor(private el: ElementRef) { }

  @HostListener('click') onInput() {
    this.el.nativeElement.setAttribute('readonly', true);
    this.datePickerRef.open()
  }

}
