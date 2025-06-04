import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  @ViewChild('introCard', { static: false }) introCard!: ElementRef<HTMLDivElement>;


  typingText = [
    'ACCESSING RESUME DATABASE...',
    'AUTHENTICATION SUCCESSFUL',
    'LOADING PROFILE...'
  ];

ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    const loader = document.getElementById('app-loader');
    const gif = document.getElementById('loader-gif') as HTMLImageElement;
    const terminalText = document.getElementById('terminal-text');

    const introCard = this.introCard;

const hide = () => {
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';

      // Animate the intro card
      requestAnimationFrame(() => {
        if (introCard?.nativeElement) {
          introCard.nativeElement.classList.remove('hidden-card');
          introCard.nativeElement.classList.add('visible-card');
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

      // Reveal site after typing
      hide();
    };

    if (gif && gif.complete) {
      runTyping();
    } else {
      gif.onload = () => runTyping();
    }

    // Fallback
    setTimeout(hide, 7000);
  }
}
}
