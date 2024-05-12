import {Component, OnInit} from '@angular/core';
import {ListItemListComponent} from "../../components/list-item-list/list-item-list.component";
import {List} from "../../shared/models/list";
import {ListService} from "../../shared/services/list.service";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
  selector: 'en-shared',
  standalone: true,
  imports: [
    ListItemListComponent
  ],
  templateUrl: './shared.component.html',
  styleUrl: './shared.component.scss'
})
export class SharedComponent implements OnInit {

  accepted: List[] = [];
  pending: List[] = [];

  constructor(private ls: ListService,
              private ms: MessageService,
              private auth: AuthenticationService
  ) {
  }

  async ngOnInit() {
    try {
      const uId = await this.auth.checkUserStatus();
      if (uId) {
        const data = await this.ls.getSharedByUserId(uId);
        console.log("data", data);
        this.accepted = data.accepted.map((l) => List.fromSource(l));
        this.pending = data.pending.map((l) => List.fromSource(l));
        console.log("accepted", this.accepted);
        console.log("pending", this.pending);
      }
    } catch (e) {
      console.error('API error:', e);
      this.ms.add({
        severity: 'error',
        summary: 'Failed to fetch shared lists',
        detail: 'Please reload page and try again.',
      });
    }
  }

}
