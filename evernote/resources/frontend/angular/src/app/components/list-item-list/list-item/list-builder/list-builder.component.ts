import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DynamicFormComponent, FormTemplate} from "../../../dynamic-form/dynamic-form.component";
import {NgIf} from "@angular/common";
import {Validators} from "@angular/forms";
import {List} from "../../../../shared/models/list";
import {ListService} from "../../../../shared/services/list.service";

@Component({
  selector: 'en-list-builder',
  standalone: true,
  imports: [
    DialogModule,
    DynamicFormComponent,
    NgIf
  ],
  templateUrl: './list-builder.component.html',
  styleUrl: './list-builder.component.scss'
})
export class ListBuilderComponent {
  @Input() show: boolean = false;
  @Output() cancel = new EventEmitter();
  @Output() created = new EventEmitter<List>();

  newTemplate: FormTemplate = {
    title: {
      type: 'string', label: 'Title',
      validators: [Validators.required],
      errors: {
        required: "Title is required"
      }
    },
    description: {type: "text", label: 'Description'},
  }
  l: List = List.empty();


  constructor(private ls: ListService) {
  }

  async create(formResult: List) {
    const newList = List.fromSource({
      id: 0,
      title: formResult.title,
      description: formResult.description
    });
    const newL = List.fromSource(await this.ls.create(newList));
    this.created.emit(newL);
  }
}
