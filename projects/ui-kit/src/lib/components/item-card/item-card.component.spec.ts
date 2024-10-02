import { TestBed } from "@angular/core/testing"
import { ItemCardComponent } from "./item-card.component"
import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ButtonComponent } from "../button/button.component";
import { ChipComponent } from "../chip/chip.component";

describe('ItemCardComponent', () => {
  it('should properly render chips', () => {
    const {fixture, getChips} = setup();
    const testData = ['Item 1', 'Item 2'];
    fixture.componentRef.setInput('tags', testData);
    fixture.detectChanges();
    let chip = getChips();
    expect(chip.length).toBe(testData.length);
    
    fixture.componentRef.setInput('tags', ['Item 3']);
    fixture.detectChanges();
    chip = getChips();
    expect(chip.length).toBe(1);
  })
})

function setup() {
  @Component({
    selector: 'df-chip',
    standalone: true,
    template: `
      <span data-testingId="chip-text" class="chip-text">
        <ng-content></ng-content>
      </span>
    `,
    providers: [
      {
        provide: ChipComponent,
        useExisting: ChipComponentStub
      }
    ]
  })
  class ChipComponentStub implements Partial<ChipComponent<unknown>> {
    @Input() value?: unknown;
  }
  TestBed.overrideComponent(ItemCardComponent, {
    remove: { imports: [ChipComponent] },
    add: { imports: [ChipComponentStub] }
  });

  const fixture = TestBed.createComponent(ItemCardComponent);
  const getChips = () =>
    fixture.debugElement.queryAll(By.directive(ChipComponent));
  fixture.componentInstance.item = {
    id: 0,
    name: 'Angular Testing Course',
    imageURL: '',
    price: 99
  }
  fixture.componentInstance.tags = ['Angular Testing'];
  fixture.detectChanges();
  return { fixture, getChips }
}