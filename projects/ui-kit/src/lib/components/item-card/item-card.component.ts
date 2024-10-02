import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Item } from '../../models/item';
import { ButtonModule } from '../button/button.module';
import { ChipComponent } from '../chip/chip.component';
import { CurrencyPipe, NgFor } from '@angular/common';

@Component({
  selector: 'df-item-card',
  standalone: true,
  imports: [
    ButtonModule,
    ChipComponent,
    CurrencyPipe,
    NgFor
  ],
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardComponent {
  @Input({ required: true }) item!: Item;

  @Input() tags: string[] = [];

  @Output() purchased = new EventEmitter<Item>();

  onPurchase() {
    this.purchased.next(this.item);
  }
}
