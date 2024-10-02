import { Component, ViewChild } from "@angular/core"
import { CanCopyToClipboardDirective } from "./can-copy-to-clipboard.directive"
import { TestBed } from "@angular/core/testing"
import { ClipboardService } from "./clipboard.service"
import { By } from "@angular/platform-browser"
import { first } from "rxjs"

describe(`CanCopyToClipboardDirective`, () => {
  it(`should emit 'true' into copied$ if string copied`, async () => {
    const {fixture, clickElAndAwait } = setup();
    let expectedValue: undefined | boolean;
    fixture.componentInstance.clipboardDir.copied$.pipe(first()).subscribe(
      value => expectedValue = value
      )
    await clickElAndAwait('[data-testingId="with-provided-test"]');
    expect(expectedValue).toBe(true)
  })
  it(`should emit 'false' into copied$ if clipboard is cleared`, async () => {
    const {fixture, clickElAndAwait } = setup();
    let expectedValue: undefined | boolean;
    fixture.componentInstance.clipboardDir.copied$.pipe(first()).subscribe(
      value => expectedValue = value
    )
    await clickElAndAwait('[data-testingId="clear"]');
    expect(expectedValue).toBe(false)
  })
  it(`should copy text provided to the [text] property`, async () => {
    const {clipboardService, clickElAndAwait} = setup();
    await clickElAndAwait('[data-testingId="with-provided-test"]')
    expect(clipboardService.copy).toHaveBeenCalledOnceWith(
      'Testing string to copy'
    )
  })
  it(`should copy the inner text if [text] property ins't provided`, async () => {
    const {clipboardService, clickElAndAwait} = setup();
    await clickElAndAwait('[data-testingId="without-provided-text"]');
    expect(clipboardService.copy)
      .toHaveBeenCalledOnceWith(
        'Inner Test Text'
      )
  })
  it(`should select and copy text inside input HTML element`, async () => {
    const {clipboardService, clickElAndAwait} = setup();
    await clickElAndAwait('[data-testingId="input-text"]');
    expect(clipboardService.copy)
      .toHaveBeenCalledOnceWith(
        'Input testing value'
      )
  })
})
function setup() {
  @Component({
    standalone: true,
    imports: [CanCopyToClipboardDirective],
    template: `
      <!-- Scenario 1 -->
      <button
        data-testingId="with-provided-test"
        dfCanCopyToClipboard
        #clipboardDir="dfClipboard"
        text="Testing string to copy"
      >Click To Copy</button>
      <button (click)="clipboardDir.clear()" data-testingId="clear">Reset</button>
      <!-- Scenario 2 -->
      <button
        data-testingId="without-provided-text"
        dfCanCopyToClipboard
      >Inner Test Text</button>
      <!-- Scenario 3 -->
      <input
        dfCanCopyToClipboard
        data-testingId="input-text"
        value="Input testing value" />
    `
  })
  class TestHost {
    @ViewChild('clipboardDir', { read: CanCopyToClipboardDirective })
    clipboardDir!: CanCopyToClipboardDirective;
  }

  const clipboardSPY = jasmine.createSpyObj<ClipboardService>(
    'ClipboardService',
    ['copy', 'clear']
  )

  TestBed.configureTestingModule({
    providers: [{ provide: ClipboardService, useValue: clipboardSPY }]
  })

  const fixture = TestBed.createComponent(TestHost);
  const debugEl = fixture.debugElement;
  const clipboardService = TestBed.inject(ClipboardService) as jasmine.SpyObj<ClipboardService>;

  clipboardService.copy.and.resolveTo();
  clipboardService.clear.and.resolveTo();

  fixture.detectChanges();

  const clickElAndAwait = async (selector: string) => {
    const copyButton = debugEl.query(By.css(selector));
    copyButton.triggerEventHandler('click');
    await fixture.whenStable();
  }

  return { fixture, debugEl, clipboardService, clickElAndAwait };
}