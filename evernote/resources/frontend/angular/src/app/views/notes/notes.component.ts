import {Component, OnInit} from '@angular/core';
import {Note} from "../../shared/models/note";
import {MessageService} from "primeng/api";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {NoteService} from "../../shared/services/note.service";
import {NoteItemComponent} from "../../components/note-item/note-item.component";
import {NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {NoteBuilderComponent} from "../../components/note-item/note-builder/note-builder.component";
import {TodoBuilderComponent} from "../../components/todo-item/todo-builder/todo-builder.component";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule} from "@angular/forms";
import {FilterBoxComponent} from "../../components/filter-box/filter-box.component";

@Component({
  selector: 'en-notes',
  standalone: true,
  imports: [
    NoteItemComponent,
    NgIf,
    ButtonModule,
    NoteBuilderComponent,
    TodoBuilderComponent,
    RadioButtonModule,
    FormsModule,
    FilterBoxComponent
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {
  notes?: Note[];
  showNew: boolean = false;

  constructor(private ns: NoteService,
              private ms: MessageService,
              private auth: AuthenticationService
  ) {
  }

  async fetchNotes(filter?: number) {
    try {
      const uId = await this.auth.checkUserStatus();
      if (uId) {
        const data = await this.ns.getByUserId(uId, filter);
        this.notes = data.map((n: Note) => Note.fromSource(n));
      }
    } catch (e) {
      console.error('API error:', e);
      this.ms.add({
        severity: 'error',
        summary: 'Failed to fetch notes',
        detail: 'Please reload page and try again.',
      });
    }
  }

  async ngOnInit() {
    await this.fetchNotes();
  }

  newNote(newN: Note) {
    this.notes?.push(newN);
    this.showNew = false;
  }

}
