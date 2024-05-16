import {Component, Input, OnInit} from '@angular/core';
import {AccordionModule} from "primeng/accordion";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {NoteItemComponent} from "../../note-item/note-item.component";
import {SharedModule} from "primeng/api";
import {UserItemComponent} from "../../user-item/user-item.component";
import {List} from "../../../shared/models/list";
import {ListService} from "../../../shared/services/list.service";
import {DialogModule} from "primeng/dialog";
import {Note} from "../../../shared/models/note";
import {Validators} from "@angular/forms";
import {DynamicFormComponent, FormTemplate} from "../../dynamic-form/dynamic-form.component";
import {NoteBuilderComponent} from "../../note-item/note-builder/note-builder.component";
import {Todo} from "../../../shared/models/todo";
import {ShareBoxComponent} from "../../share-box/share-box.component";

@Component({
  selector: 'en-list-item',
  standalone: true,
  imports: [
    AccordionModule,
    ButtonModule,
    NgIf,
    NoteItemComponent,
    SharedModule,
    UserItemComponent,
    DialogModule,
    DynamicFormComponent,
    NoteBuilderComponent,
    ShareBoxComponent
  ],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent implements OnInit {
  @Input() list?: List
  @Input() owner: boolean = true;
  @Input() pending: boolean = false;
  l?: List

  deleted: boolean = false;
  showEdit: boolean = false;
  showShare: boolean = false;
  showDelete: boolean = false;
  showNewNote: boolean = false;

  editTemplate?: FormTemplate

  constructor(private ls: ListService) {
  }

  ngOnInit() {
    this.l = this.list;
  }

  edit() {
    this.editTemplate = {
      title: {
        type: 'string', label: 'Title',
        validators: [Validators.required],
        errors: {
          required: "Title is required"
        }
      },
      description: {type: "text", label: 'Description'},
    }
    this.showEdit = true;
  }


  exculdes() {
    return this.l ?
      this.l.shares
        ? this.l.shares?.map((s) => s.user_id)
        : [] : [];
  }

  async delete() {
    this.showDelete = false;
    if (this.list?.id) {
      this.deleted = await this.ls.delete(this.list.id);
    }
  }

  async update(formResult: List, raw = false) {
    this.showEdit = false;
    const newList = raw ? formResult : List.fromSource({
      id: this.l?.id,
      title: formResult.title ?? this.l?.title,
      description: formResult.description ?? this.l?.description
    });
    this.l = List.fromSource(await this.ls.update(newList));
  }

  async share(id: number) {
    if (this.l) this.l = List.fromSource(await this.ls.share(this.l.id, id));
    this.showShare = false;
  }

  async newNote(newN: Note) {
    if (this.l) {
      this.l.notes?.push(newN);
      await this.update(this.l, true);
    }
    this.showNewNote = false;
  }

  async acceptShare() {
    if (this.l?.id) {
      this.l = List.fromSource(await this.ls.acceptShare(this.l.id));
      this.pending = false;
    }
  }

  async removeShare(id: number) {
    await this.ls.removeShare(id).then(async () => {
      if (this.l?.shares) {
        const index = this.l.shares.findIndex((i) => i.id === id);
        this.deleted = true;
        this.l = List.fromSource(await this.ls.getById(this.l.id));
        this.deleted = false;
      }
    });
  }
}
