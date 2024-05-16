import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {User} from "../models/user";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "./authentication.service";
import {List} from "../models/list";
import {Note} from "../models/note";

interface SharedLists {
  accepted: List[]
  pending: List[]
}

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(
    private api: ApiService) {
  }

  async getById(id: number | string): Promise<List> {
    return await this.api.issueRequest(`/lists/${id}`);
  }

  async getByUserId(id: number | string, filter = -1): Promise<List[]> {
    const f = filter != -1 ? `?filter=${filter}` : '';
    return await this.api.issueRequest(`/lists/user/${id}` + f);
  }

  async getSharedByUserId(id: number | string): Promise<SharedLists> {
    return await this.api.issueRequest(`/lists/user/${id}?sharedWith=1`);
  }

  async create(list: List): Promise<List> {
    return await this.api.issueRequest(`/lists`, {
      method: "POST",
      body: JSON.stringify(list)
    });
  }

  async update(list: List): Promise<List> {
    return await this.api.issueRequest(`/lists/${list.id}`, {
      method: "PUT",
      body: JSON.stringify(list)
    });
  }

  async delete(id: number | string): Promise<boolean> {
    return await this.api.issueRequest(`/lists/${id}`, {
      method: "DELETE"
    });
  }

  async share(listId: number | string, userId: number | string): Promise<List> {
    return await this.api.issueRequest(`/lists/share/${listId}`, {
      method: "PUT",
      body: JSON.stringify({
        user_id: userId
      })
    });
  }

  async acceptShare(id: number | string): Promise<List> {
    return await this.api.issueRequest(`/lists/accept/${id}`, {
      method: "PUT"
    });
  }

  async removeShare(id: number | string): Promise<boolean> {
    return await this.api.issueRequest(`/share/${id}`, {
      method: "DELETE"
    });
  }

}
