import {Component, Input, OnInit} from '@angular/core';
import {Note} from "../../shared/models/note";
import {NgIf} from "@angular/common";
import {TodoItemComponent} from "../todo-item/todo-item.component";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {NoteService} from "../../shared/services/note.service";
import {DynamicFormComponent, FormTemplate} from "../dynamic-form/dynamic-form.component";
import {Validators} from "@angular/forms";
import {Todo} from "../../shared/models/todo";
import {TodoBuilderComponent} from "../todo-item/todo-builder/todo-builder.component";
import {TagService} from "../../shared/services/tag.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'en-note-item',
  standalone: true,
  imports: [
    NgIf,
    TodoItemComponent,
    ButtonModule,
    DialogModule,
    DynamicFormComponent,
    TodoBuilderComponent
  ],
  templateUrl: './note-item.component.html',
  styleUrl: './note-item.component.scss'
})
export class NoteItemComponent implements OnInit {
  @Input() note: Note | undefined
  @Input() owner: boolean = true
  n?: Note

  deleted: boolean = false;
  showEdit: boolean = false;
  showDelete: boolean = false;
  showNewTodo: boolean = false;

  editTemplate?: FormTemplate

  constructor(private ns: NoteService,
              private tags: TagService,
              private ms: MessageService) {
  }

  ngOnInit() {
    this.n = this.note;
  }

  edit() {
    this.editTemplate = {
      title: {type: 'string', label: 'Title'},
      text: {
        type: "text", label: 'Note text',
        validators: [Validators.required],
        errors: {
          required: "Note text is required"
        }
      },
      important: {
        type: "boolean", label: 'Important?',
      },
      image: {type: 'string', label: 'Image url'},
      tags: {
        type: 'tags', label: 'Tags',
      }
    }
    this.showEdit = true;
  }

  async delete() {
    this.showDelete = false;
    if (this.note?.id) {
      this.deleted = await this.ns.delete(this.note.id);
    }
    await this.tags.getTags(this.ms);
  }

  async update(formResult: Note, raw = false) {
    this.showEdit = false;
    const newNote = raw ? formResult : Note.fromSource({
      id: this.n?.id,
      text: formResult.text ?? this.n?.text,
      important: formResult.important,
      title: formResult.title ?? this.n?.title,
      image: formResult.image ?? this.n?.image,
      tags: formResult.tags ?? this.n?.tags
    });
    this.n = Note.fromSource(await this.ns.update(newNote));
    await this.tags.getTags(this.ms);
  }

  async newTodo(newT: Todo) {
    if (this.n) {
      await this.update(this.n, true).then(() => {
        if (this.n) this.n.todos?.push(newT);
      });
    }
    this.showNewTodo = false;
  }

}
