import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {FormErrorComponent} from "../form-error/form-error.component";
import {InputTextModule} from "primeng/inputtext";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ColorPickerModule} from "primeng/colorpicker";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputSwitchModule} from "primeng/inputswitch";
import {FilterBoxComponent} from "../filter-box/filter-box.component";
import {Tag} from "../../shared/models/tag";

export interface FormTemplate {
  [key: string]: {
    type: 'string' | 'text' | 'boolean' | 'date' | 'color' | 'tags'
    label: string
    validators?: any[]
    errors?: { [error: string]: string }
    dynamicItems?: FormArray
  }
}

@Component({
  selector: 'en-dynamic-form',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    FormErrorComponent,
    InputTextModule,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    NgForOf,
    KeyValuePipe,
    ColorPickerModule,
    InputTextareaModule,
    InputSwitchModule,
    FilterBoxComponent
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  @Input() prefix?: string
  @Input() source: any
  @Input() template?: FormTemplate
  @Output() cancel = new EventEmitter();
  @Output() submitForm = new EventEmitter<any>();
  data: any;
  fg?: FormGroup;
  showTagSelect: boolean = false;

  protected readonly Object = Object;

  constructor(private fb: FormBuilder) {
  }

  retainOrder = (a: any, b: any): number => 0;

  private buildFormGroup(data: any, temp: FormTemplate): FormGroup {
    const fgObject: { [key: string]: any } = {};
    for (const key in temp) {
      const item = temp[key];
      if (['tags'].includes(item.type)) {
        const tags: FormArray = this.fb.array([]);
        if (data[key]) {
          for (const d of data[key]) {
            const d_fg = this.fb.group(d);
            tags.push(d_fg);
          }
        }
        item.dynamicItems = fgObject[key] = tags;
      } else {
        fgObject[key] = [data[key], item.validators];
      }
    }
    return this.fb.group(fgObject);
  }

  addDynamicItem(key: string, existing?: Tag) {
    (this.fg?.controls[key] as FormArray).push(
      this.fb.group(existing ?? {
        id: 0, label: '', color: '#000000'
      })
    );
    this.showTagSelect = false;
  }

  removeDynamicItem(key: string, i: number) {
    (this.fg?.controls[key] as FormArray).removeAt(i);
  }

  ngOnInit() {
    this.data = this.source;
    if (this.template) {
      this.fg = this.buildFormGroup(this.data, this.template);
      console.log(this.fg);
    }
  }
}
