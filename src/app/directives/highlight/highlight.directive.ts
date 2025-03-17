import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {


  public appHighlight = input<string>('yellow');

  constructor(private el: ElementRef) { }

  // Al pasar el mouse sobre el elemento, se aplica el color.
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight());
  }

  // Al salir el mouse, se remueve el color de fondo.
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
