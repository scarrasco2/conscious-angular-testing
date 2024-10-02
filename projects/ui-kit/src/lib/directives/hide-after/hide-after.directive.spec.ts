import { Component } from "@angular/core"
import { HideAfterDirective } from "./hide-after.directive"
import { TestBed, fakeAsync, flush, tick } from "@angular/core/testing"
import { By } from "@angular/platform-browser"

describe(`HideAfterDirective`, () => {
  it(`should render the initial template`, fakeAsync(() => {
    const {debugEl} = setup();
    const tpl = debugEl.query(By.css('[data-testingId="banner"]'))
    expect(tpl).not.toBeNull();
    flush();
  }))
  it(`should remove a template after defined timeout`, fakeAsync(() => {
    const {debugEl} = setup();
    flush(); // emulation of time passage
    
    const tpl = debugEl.query(By.css('[data-testingId="banner"]'))
    expect(tpl).toBeNull();
    
  }))
  it(`should replace template with a placeholder`, fakeAsync(() => {
    const {debugEl} = setup();
    flush(); // emulation of time passage
    
    const tpl = debugEl.query(By.css('[data-testingId="alt-banner"'))
    expect(tpl).not.toBeNull();
  }))
  it(`should update count down clock every second`, fakeAsync(() => {
    const {fixture, debugEl} = setup();
    let counterDebugEl = debugEl.query(By.css('[data-testingId="counter"]'));
    expect(counterDebugEl.nativeElement.innerText).toBe('3');
    
    for (let counter = 2; counter > 0; counter--) {
      tick(1000);
      fixture.detectChanges();
      counterDebugEl = debugEl.query(By.css('[data-testingId="counter"]'));
      expect(counterDebugEl.nativeElement.innerText).toBe(String(counter));      
    }
    flush();
  }))
})

function setup() {
  @Component({
    standalone: true,
    imports: [HideAfterDirective],
    template: `
      <div data-testingId="banner"
        *hideAfter="3000; then altBanner; let counter = counter">
          This Banner will be removed in
        <span data-testingId="counter">{{ counter }}</span> seconds...
      </div>
      <ng-template #altBanner>
        <div data-testingId="alt-banner">Here was a banner...</div>
      </ng-template>
    `
  })
  class TestHost {}
  const fixture = TestBed.createComponent(TestHost);
  const debugEl = fixture.debugElement;
  fixture.detectChanges();
  return { fixture, debugEl }
}