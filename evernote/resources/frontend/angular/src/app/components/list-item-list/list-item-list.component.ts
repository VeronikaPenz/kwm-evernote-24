import {Component, Input} from '@angular/core';
import {List} from "../../shared/models/list";
import {NgIf} from "@angular/common";
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {UserItemComponent} from "../user-item/user-item.component";
import {NoteItemComponent} from "../note-item/note-item.component";
import {ListItemComponent} from "./list-item/list-item.component";

@Component({
  selector: 'en-list-item-list',
  standalone: true,
  imports: [
    NgIf,
    AccordionModule,
    ButtonModule,
    UserItemComponent,
    NoteItemComponent,
    ListItemComponent
  ],
  templateUrl: './list-item-list.component.html',
  styleUrl: './list-item-list.component.scss'
})
export class ListItemListComponent {
  @Input() lists?: List[]
  @Input() owner: boolean = true;
  @Input() pending: boolean = false;
}
