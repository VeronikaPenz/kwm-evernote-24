import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {ListItemListComponent} from "../../components/list-item-list/list-item-list.component";
import {List} from "../../shared/models/list";
import {ListService} from "../../shared/services/list.service";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {ButtonModule} from "primeng/button";
import {ListBuilderComponent} from "../../components/list-item-list/list-item/list-builder/list-builder.component";
import {FilterBoxComponent} from "../../components/filter-box/filter-box.component";

@Component({
  selector: 'en-lists',
  standalone: true,
  imports: [
    ListItemListComponent,
    ButtonModule,
    ListBuilderComponent,
    FilterBoxComponent
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit {
  lists?: List[];
  showNew: boolean = false;

  constructor(private ls: ListService,
              private ms: MessageService,
              private auth: AuthenticationService
  ) {
  }

  async fetchLists(filter?: number) {
    try {
      const uId = await this.auth.checkUserStatus();
      if (uId) {
        const data = await this.ls.getByUserId(uId, filter);
        this.lists = data.map((l) => List.fromSource(l));
      }
    } catch (e) {
      console.error('API error:', e);
      this.ms.add({
        severity: 'error',
        summary: 'Failed to fetch lists',
        detail: 'Please reload page and try again.',
      });
    }
  }

  async ngOnInit() {
    await this.fetchLists();
  }

  newList(newL: List) {
    this.lists?.push(newL);
    this.showNew = false;
  }
}
