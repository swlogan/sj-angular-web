import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  @ViewChild('introCard', { static: false }) introCard!: ElementRef<HTMLDivElement>;

  typingText = [
    'ACCESSING RESUME DATA...',
    'AUTHENTICATION SUCCESSFUL',
    'LOADING USER PROFILE...'
  ];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.getElementById('app-loader');
      const gif = document.getElementById('loader-gif') as HTMLImageElement;
      const terminalText = document.getElementById('terminal-text');

      const hide = () => {
        if (loader) {
          loader.classList.add('hidden');
          setTimeout(() => {
            loader.style.display = 'none';

            // Force Angular to recognize the class change
            this.ngZone.run(() => {
              if (this.introCard?.nativeElement) {
                this.introCard.nativeElement.classList.remove('hidden-card');
                this.introCard.nativeElement.classList.add('visible-card');
              }
            });
          }, 1000);
        }
      };

      const runTyping = async () => {
        if (terminalText) {
          for (const line of this.typingText) {
            for (let i = 0; i <= line.length; i++) {
              terminalText.innerHTML = line.slice(0, i) + (i % 2 ? '_' : '');
              await new Promise(res => setTimeout(res, 40));
            }
            terminalText.innerHTML += '<br>';
            await new Promise(res => setTimeout(res, 600));
          }
        }

        hide();
      };

      if (gif && gif.complete) {
        runTyping();
      } else {
        gif.onload = () => runTyping();
      }

      setTimeout(hide, 7000);
    }
  }
}
