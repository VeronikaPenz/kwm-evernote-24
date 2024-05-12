import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DynamicFormComponent, FormTemplate} from "../../dynamic-form/dynamic-form.component";
import {NgIf} from "@angular/common";
import {Todo} from "../../../shared/models/todo";
import {Validators} from "@angular/forms";
import {TodoService} from "../../../shared/services/todo.service";
import {TagService} from "../../../shared/services/tag.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'en-todo-builder',
  standalone: true,
  imports: [
    DialogModule,
    DynamicFormComponent,
    NgIf
  ],
  templateUrl: './todo-builder.component.html',
  styleUrl: './todo-builder.component.scss'
})
export class TodoBuilderComponent {
  @Input() show: boolean = false;
  @Output() cancel = new EventEmitter();
  @Output() created = new EventEmitter<Todo>();
  newTemplate: FormTemplate = {
    title: {
      type: 'string', label: 'Title',
      validators: [Validators.required],
      errors: {
        required: "Title is required"
      }
    },
    description: {type: 'string', label: 'Description'},
    due_date: {type: 'date', label: 'Due date'},
    tags: {
      type: 'tags', label: 'Tags',
    }
  }
  t: Todo = Todo.empty();

  constructor(private ts: TodoService,
              private tags: TagService,
              private ms: MessageService) {
  }

  async create(formResult: Todo) {
    const newTodo = Todo.fromSource({
      id: 0,
      title: formResult.title,
      checked: false,
      description: formResult.description,
      due_date: formResult.due_date,
      tags: formResult.tags
    });
    const newT = Todo.fromSource(await this.ts.create(newTodo));
    this.created.emit(newT);
    await this.tags.getTags(this.ms);
  }
}
