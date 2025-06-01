import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('app-loader');
      const gif = document.getElementById('loader-gif') as HTMLImageElement;

      const hide = () => {
        if (loader) {
          loader.classList.add('hidden');
          setTimeout(() => (loader.style.display = 'none'), 1000);
        }
      };

      // Hide after 4 seconds even if GIF never loads
      setTimeout(hide, 4000);

      // Also try to hide as soon as GIF is loaded
      if (gif) {
        if (gif.complete) {
          hide();
        } else {
          gif.onload = () => hide();
        }
      }
    }
  }
}
