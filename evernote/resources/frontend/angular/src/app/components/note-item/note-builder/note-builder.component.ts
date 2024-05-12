import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DynamicFormComponent, FormTemplate} from "../../dynamic-form/dynamic-form.component";
import {NgIf} from "@angular/common";
import {Note} from "../../../shared/models/note";
import {Validators} from "@angular/forms";
import {NoteService} from "../../../shared/services/note.service";
import {TagService} from "../../../shared/services/tag.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'en-note-builder',
  standalone: true,
  imports: [
    DialogModule,
    DynamicFormComponent,
    NgIf
  ],
  templateUrl: './note-builder.component.html',
  styleUrl: './note-builder.component.scss'
})
export class NoteBuilderComponent {
  @Input() show: boolean = false;
  @Output() cancel = new EventEmitter();
  @Output() created = new EventEmitter<Note>();

  newTemplate: FormTemplate = {
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
  n: Note = Note.empty();

  constructor(private ns: NoteService,
              private tags: TagService,
              private ms: MessageService) {
  }

  async create(formResult: Note) {
    const newNote = Note.fromSource({
      id: 0,
      text: formResult.text,
      important: formResult.important,
      title: formResult.title,
      image: formResult.image,
      tags: formResult.tags
    });
    const newN = Note.fromSource(await this.ns.create(newNote));
    this.created.emit(newN);
    await this.tags.getTags(this.ms);
  }

}
