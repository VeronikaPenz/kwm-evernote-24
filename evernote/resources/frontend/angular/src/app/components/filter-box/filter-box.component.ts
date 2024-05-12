import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {RadioButtonModule} from "primeng/radiobutton";
import {Tag} from "../../shared/models/tag";
import {FormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";
import {NgIf} from "@angular/common";
import {TagService} from "../../shared/services/tag.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'en-filter-box',
  standalone: true,
  imports: [
    RadioButtonModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './filter-box.component.html',
  styleUrl: './filter-box.component.scss'
})
export class FilterBoxComponent implements OnInit, OnDestroy {
  @Input() reduced = false;
  @Output() change = new EventEmitter<Tag>();
  filter: Tag = {id: -1, label: ''} as Tag;
  tags: Tag[] = [];
  tagSub?: Subscription;

  constructor(public ts: TagService,
              private ms: MessageService) {
  }

  async ngOnInit() {
    this.tagSub = this.ts.tags.subscribe((v) => {
      this.tags = v;
    });
    await this.ts.getTags(this.ms);
  }

  ngOnDestroy() {
    this.tagSub?.unsubscribe();
  }
}
