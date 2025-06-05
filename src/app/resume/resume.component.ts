import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements AfterViewInit {
  @ViewChild('resumeCard') resumeCard!: ElementRef<HTMLDivElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use `document` now
      const loader = document.getElementById('app-loader');
      if (loader) {
        loader.style.display = 'none';
      }

      setTimeout(() => {
        this.resumeCard.nativeElement.classList.remove('hidden-card');
        this.resumeCard.nativeElement.classList.add('visible-card');
      }, 300);
    }
  }
}
