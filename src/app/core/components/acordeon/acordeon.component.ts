
import { Component, EventEmitter, Input, Output , SimpleChanges, OnChanges} from '@angular/core';

@Component({
  selector: 'app-acordeon',
  templateUrl: './acordeon.component.html',
  styleUrl: './acordeon.component.css'
})
//implements OnChanges
export class AcordeonComponent   {

  @Input() disable: boolean = true;

  @Input() items: any[] = []// = [{ name: "Promesa", list: [{ name: "crear", state: false }], child: [{ name: "Promesa", list: [{ name: "eliminar", state: false }]}] }];
  @Output() outPutData = new EventEmitter<any>();
  @Input() openOnFilter: boolean = false;
  @Input() abierto: boolean = false;
  @Output() estadoCambiado = new EventEmitter<boolean>();


  minusSVG = `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95l4.95-4.95a1 1 0 0 1 1.414 1.414z"/></g></svg>
            `;

  // SVG for Plus icon
  plusSVG = `
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z"/></g></svg>
          `;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abierto'] && this.abierto) {
      this.abrirAutomáticamente();
    }
  }


  toggleAccordion(parent: number): void {
    const content = document.getElementById(`content-${parent}`);
    const icon = document.getElementById(`icon-${parent}`);

    if (content!.style.maxHeight && content!.style.maxHeight !== '0px') {
      content!.style.maxHeight = '0';
      icon!.innerHTML = this.plusSVG;
      this.estadoCambiado.emit(false);
    } else {
      content!.style.maxHeight = content!.scrollHeight + 'px';
      icon!.innerHTML = this.minusSVG;
      this.estadoCambiado.emit(true);
    }
  }

  toggleAccordionChild(child: number, parent: number) {

    const content = document.getElementById(`content-ch-${parent}-${child}`);
    const icon = document.getElementById(`icon-ch-${parent}-${child}`);
    const contentParent = document.getElementById(`content-${parent}`);
    // Toggle the content's max-height for smooth opening and closing
    if (content!.style.maxHeight && content!.style.maxHeight !== '0px') {
      content!.style.maxHeight = '0';
      icon!.innerHTML = this.plusSVG;
      contentParent!.style.maxHeight = contentParent!.scrollHeight + 'px';
    } else {
      content!.style.maxHeight = content!.scrollHeight + 'px';
      icon!.innerHTML = this.minusSVG;
      content!.addEventListener("transitionend", () => {
        contentParent!.style.maxHeight = contentParent!.scrollHeight + 'px';
      })
    }
  }

  changesDetect() {
    this.outPutData.emit(this.items);
  }

  selectAll(data: any) {
    for (let index = 0; index < data.list.length; index++) {
      data.list[index].state = data.state;

    }
    this.outPutData.emit(this.items);
  }

  abrirAutomáticamente(): void {
    const content = document.getElementById(`content-0`);
    const icon = document.getElementById(`icon-0`);
    if (content && icon) {
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.innerHTML = this.minusSVG;
      this.estadoCambiado.emit(true);
    }
  }
}
