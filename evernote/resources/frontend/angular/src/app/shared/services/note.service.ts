import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {Note} from "../models/note";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    private api: ApiService) {
  }

  async getById(id: number | string): Promise<Note> {
    return await this.api.issueRequest(`/notes/${id}`);
  }

  async getByUserId(id: number | string, filter = -1): Promise<Note[]> {
    const f = filter != -1 ? `?filter=${filter}` : '';
    return await this.api.issueRequest(`/notes/user/${id}` + f);
  }

  async getByListId(id: number | string): Promise<Note[]> {
    return await this.api.issueRequest(`/notes/byList/${id}`);
  }

  async create(note: Note): Promise<Note> {
    return await this.api.issueRequest(`/notes`, {
      method: "POST",
      body: JSON.stringify(note)
    });
  }

  async update(note: Note): Promise<Note> {
    return await this.api.issueRequest(`/notes/${note.id}`, {
      method: "PUT",
      body: JSON.stringify(note)
    });
  }

  async delete(id: number | string): Promise<boolean> {
    return await this.api.issueRequest(`/notes/${id}`, {
      method: "DELETE"
    });
  }

}
