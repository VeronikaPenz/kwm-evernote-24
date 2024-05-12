import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {TodoItemComponent} from "../../components/todo-item/todo-item.component";
import {Todo} from "../../shared/models/todo";
import {TodoService} from "../../shared/services/todo.service";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  selector: 'en-assigned',
  standalone: true,
  imports: [
    NgIf,
    TodoItemComponent
  ],
  templateUrl: './assigned.component.html',
  styleUrl: './assigned.component.scss'
})
export class AssignedComponent implements OnInit {
  todos?: Todo[]

  constructor(private ts: TodoService,
              private ms: MessageService,
              private auth: AuthenticationService
  ) {
  }

  async ngOnInit() {
    try {
      const uId = await this.auth.checkUserStatus();
      if (uId) {
        const data = await this.ts.getSharedByUserId(uId);
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
}
