import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { toBooleanProperty } from '../../utils/type-coercion';
import { CanDisableDirective } from '../../directives/can-disable/can-disable.directive';
import { HasTabIndexDirective } from '../../directives/has-tab-index/has-tab-index.directive';

export const BUTTON_CLASSES = {
  solid: 'solid-button',
  stroked: 'stroked-button',
  dashed: 'dashed-button'
} as const;

export type ButtonAppearance = keyof typeof BUTTON_CLASSES;
export type ButtonClasses = (typeof BUTTON_CLASSES)[ButtonAppearance];

@Component({
  selector: 'button[dfButton],a[dfButton]',
  template: `
    <span data-testingId="label" class="button-label">
      <ng-content></ng-content>
    </span>
    <span data-testingId="loader" *ngIf="loading" class="button-loader"></span>
  `,
  styleUrls: ['./button.component.scss'],
  hostDirectives: [
    {
      directive: CanDisableDirective,
      inputs: ['disabled'],
    },
    {
      directive: HasTabIndexDirective,
      inputs: ['tabIndex', 'pauseFocusing: disabled'],
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input()
  appearance: ButtonAppearance = 'solid';

  @Input()
  set loading(value: any) {
    this.#loading = toBooleanProperty(value);
  }
  get loading(): boolean {
    return this.#loading;
  }
  #loading = false;

  @HostBinding('class')
  protected get buttonTypeHostClass(): ButtonClasses {
    return BUTTON_CLASSES[this.appearance];
  }
}
