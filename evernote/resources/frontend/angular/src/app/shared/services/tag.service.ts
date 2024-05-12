import {Injectable} from '@angular/core';
import {Tag} from "../models/tag";
import {MessageService} from "primeng/api";
import {ApiService} from "./api.service";
import {AuthenticationService} from "./authentication.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private tagSource = new BehaviorSubject<Tag[]>([])
  public tags = this.tagSource.asObservable();

  constructor(
    private api: ApiService,
    private auth: AuthenticationService) {
  }

  async getTags(ms: MessageService) {
    try {
      const uId = await this.auth.checkUserStatus();
      if (uId) this.tagSource.next(await this.api.issueRequest(`/tags/${uId}`));
    } catch (e) {
      console.error('API error:', e);
      ms.add({
        severity: 'error',
        summary: 'Failed to fetch tags',
        detail: 'Please reload page and try again.',
      });
    }
  }
}
