import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Todo} from "../models/todo";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private api: ApiService) {
  }

  async getByUserId(id: number | string, filter = -1): Promise<Todo[]> {
    const f = filter != -1 ? `?filter=${filter}` : '';
    return await this.api.issueRequest(`/todos/user/${id}` + f);
  }

  async getSharedByUserId(id: number | string): Promise<Todo[]> {
    return await this.api.issueRequest(`/todos/user/${id}?sharedWith=1`);
  }

  async getByNoteId(id: number | string): Promise<Todo[]> {
    return await this.api.issueRequest(`/todos/byNote/${id}`);
  }

  async create(todo: Todo): Promise<Todo> {
    return await this.api.issueRequest(`/todos`, {
      method: "POST",
      body: JSON.stringify(todo)
    });
  }

  async update(todo: Todo): Promise<Todo> {
    return await this.api.issueRequest(`/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify(todo)
    });
  }

  async delete(id: number | string): Promise<boolean> {
    return await this.api.issueRequest(`/todos/${id}`, {
      method: "DELETE"
    });
  }

}
