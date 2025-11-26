import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[busyIf]'
})
export class BusyIfDirective implements OnChanges {

  @Input('busyIf') isBusy: boolean = false;

  private spinnerEl: HTMLElement | null = null;
  private originalContent: string | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.isBusy) {
      this.showSpinner();
    } else {
      this.hideSpinner();
    }
  }

  private showSpinner(): void {
    const button = this.el.nativeElement as HTMLButtonElement;

    // Store original text (once)
    if (!this.originalContent) {
      this.originalContent = button.innerHTML;
    }

    // Disable button
    this.renderer.setProperty(button, 'disabled', true);

    // Add spinner
    this.spinnerEl = this.renderer.createElement('span');
    this.renderer.addClass(this.spinnerEl, 'spinner-border');
    this.renderer.addClass(this.spinnerEl, 'spinner-border-sm');
    this.renderer.addClass(this.spinnerEl, 'me-2');
    this.renderer.setAttribute(this.spinnerEl, 'role', 'status');
    this.renderer.setAttribute(this.spinnerEl, 'aria-hidden', 'true');

    // Replace content
    this.renderer.setProperty(button, 'innerHTML', '');
    this.renderer.appendChild(button, this.spinnerEl);
    const text = this.renderer.createText(' Processing...');
    this.renderer.appendChild(button, text);
  }

  private hideSpinner(): void {
    const button = this.el.nativeElement as HTMLButtonElement;
    this.renderer.setProperty(button, 'disabled', false);
    if (this.originalContent) {
      this.renderer.setProperty(button, 'innerHTML', this.originalContent);
    }
  }
}
