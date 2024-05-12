import {Component, Input, OnInit} from '@angular/core';
import {Todo} from "../../shared/models/todo";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserItemComponent} from "../user-item/user-item.component";
import {NgIf} from "@angular/common";
import {TodoService} from "../../shared/services/todo.service";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {FormErrorComponent} from "../form-error/form-error.component";
import {DynamicFormComponent, FormTemplate} from "../dynamic-form/dynamic-form.component";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {TagService} from "../../shared/services/tag.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'en-todo-item',
  standalone: true,
  imports: [
    CheckboxModule,
    FormsModule,
    UserItemComponent,
    NgIf,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    FormErrorComponent,
    DynamicFormComponent
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent implements OnInit {
  @Input() todo?: Todo
  @Input() owner: boolean = true
  t?: Todo

  deleted: boolean = false;
  checked: boolean = false;
  showEdit: boolean = false;
  showDelete: boolean = false;
  sharedWithMe: boolean = false;

  editTemplate?: FormTemplate

  constructor(
    private ts: TodoService,
    private auth: AuthenticationService,
    private tags: TagService,
    private ms: MessageService
  ) {
  }

  async ngOnInit() {
    this.t = this.todo;
    this.sharedWithMe = this.t?.share?.user_id + '' === await this.auth.checkUserStatus();
    this.checked = this.todo?.checked ?? false;
  }

  async changeStatus() {
    const newTodo = Todo.fromSource(this.t);
    newTodo.checked = this.checked;
    await this.ts.update(newTodo);
  }

  edit() {
    this.editTemplate = {
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
    this.showEdit = true;
  }

  async delete() {
    this.showDelete = false;
    if (this.todo?.id) {
      this.deleted = await this.ts.delete(this.todo.id);
    }
    await this.tags.getTags(this.ms);
  }

  async update(formResult: Todo) {
    this.showEdit = false;
    const newTodo = Todo.fromSource({
      id: this.t?.id,
      title: formResult.title ?? this.t?.title,
      checked: this.checked,
      description: formResult.description ?? this.t?.description,
      due_date: formResult.due_date ?? this.t?.due_date,
      tags: formResult.tags ?? this.t?.tags,
      note_id: this.t?.note_id
    });
    this.t = Todo.fromSource(await this.ts.update(newTodo));
    this.sharedWithMe = this.t?.share?.user_id + '' === await this.auth.checkUserStatus();
    await this.tags.getTags(this.ms);
  }
}
