import {Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {User} from "../models/user";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser?: User

  constructor(
    private api: ApiService,
    private auth: AuthenticationService) {
  }

  async updateCurrentUser(ms: MessageService, reset = false) {
    if (!this.currentUser || reset) {
      try {
        const uId = await this.auth.checkUserStatus();
        if (uId) this.currentUser = await this.getById(uId);
      } catch (e) {
        console.error('API error:', e);
        ms.add({
          severity: 'error',
          summary: 'Failed to fetch current user',
          detail: 'Please reload page and try again.',
        });
      }
    }
  }

  async getById(id: number | string): Promise<User> {
    return await this.api.issueRequest(`/users/${id}`);
  }

  async getAll(): Promise<User[]> {
    return await this.api.issueRequest(`/users`);
  }
}
