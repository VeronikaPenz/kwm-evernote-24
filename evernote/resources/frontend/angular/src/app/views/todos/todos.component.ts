import {Component, OnInit} from '@angular/core';
import {Todo} from "../../shared/models/todo";
import {TodoItemComponent} from "../../components/todo-item/todo-item.component";
import {NgIf} from "@angular/common";
import {NoteService} from "../../shared/services/note.service";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {TodoService} from "../../shared/services/todo.service";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DynamicFormComponent, FormTemplate} from "../../components/dynamic-form/dynamic-form.component";
import {Validators} from "@angular/forms";
import {TodoBuilderComponent} from "../../components/todo-item/todo-builder/todo-builder.component";
import {FilterBoxComponent} from "../../components/filter-box/filter-box.component";
import {filter} from "rxjs";

@Component({
  selector: 'en-todos',
  standalone: true,
  imports: [
    TodoItemComponent,
    NgIf,
    ButtonModule,
    DialogModule,
    DynamicFormComponent,
    TodoBuilderComponent,
    FilterBoxComponent
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss'
})
export class TodosComponent implements OnInit {
  todos?: Todo[]
  showNew: boolean = false;

  constructor(private ts: TodoService,
              private ms: MessageService,
              private auth: AuthenticationService
  ) {
  }

  async fetchTodos(filter?: number) {
    try {
      const uId = await this.auth.checkUserStatus();
      if (uId) {
        const data = await this.ts.getByUserId(uId, filter);
        this.todos = data.map((t) => Todo.fromSource(t));
      }
    } catch (e) {
      console.error('API error:', e);
      this.ms.add({
        severity: 'error',
        summary: 'Failed to fetch todos',
        detail: 'Please reload page and try again.',
      });
    }
  }

  async ngOnInit() {
    await this.fetchTodos();
  }

  newTodo(newT: Todo) {
    this.todos?.push(newT);
    this.showNew = false;
  }

}
