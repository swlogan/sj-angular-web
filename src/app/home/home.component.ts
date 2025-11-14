import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavigationComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  showLoader = true; // Start with loader visible to prevent flash

  typingText = [
    'ACCESSING RESUME DATA...',
    'AUTHENTICATION SUCCESSFUL',
    'LOADING USER PROFILE...',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Check sessionStorage immediately to prevent flash on subsequent visits
    if (isPlatformBrowser(this.platformId)) {
      const navigated = sessionStorage.getItem('navigated') === 'true';
      if (navigated) {
        this.showLoader = false;
      }
    }
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const navigated = sessionStorage.getItem('navigated') === 'true';

    const reveal = () => {
      this.ngZone.run(() => {
        this.showLoader = false;
        sessionStorage.setItem('navigated', 'true');
      });
    };

    const runTyping = async () => {
      // Wait for DOM element to be available
      let terminalText: HTMLElement | null = null;
      let attempts = 0;
      while (!terminalText && attempts < 50) {
        terminalText = document.getElementById('terminal-text');
        if (!terminalText) {
          await new Promise((res) => setTimeout(res, 100));
          attempts++;
        }
      }

      if (!terminalText) {
        console.error('terminalText element not found after waiting');
        reveal();
        return;
      }

      console.log('Terminal text element found, starting typing effect');
      
      let currentDisplayText = '';
      let cursorVisible = true;
      let blinkInterval: any = null;
      
      const updateDisplay = () => {
        if (terminalText) {
          terminalText.innerHTML = currentDisplayText + (cursorVisible ? '<span class="cursor">_</span>' : '');
        }
      };

      // Start cursor blinking
      blinkInterval = setInterval(() => {
        cursorVisible = !cursorVisible;
        if (terminalText) {
          terminalText.innerHTML = currentDisplayText + (cursorVisible ? '<span class="cursor">_</span>' : '');
        }
      }, 500);

      // Initial display with cursor
      updateDisplay();

      for (const line of this.typingText) {
        for (let i = 0; i <= line.length; i++) {
          currentDisplayText = line.slice(0, i);
          cursorVisible = true; // Keep cursor visible while typing
          updateDisplay();
          await new Promise((res) => setTimeout(res, 50));
        }
        currentDisplayText = line + '<br>';
        updateDisplay();
        await new Promise((res) => setTimeout(res, 600));
      }

      if (blinkInterval) {
        clearInterval(blinkInterval);
      }
      
      // Final display without cursor
      if (terminalText) {
        terminalText.innerHTML = currentDisplayText;
      }
      
      await new Promise((res) => setTimeout(res, 700));
      reveal();
    };

    if (!navigated) {
      this.ngZone.run(() => {
        this.showLoader = true;
        this.cd.detectChanges(); // force DOM update
      });

      // Wait for Angular to render the DOM
      setTimeout(() => {
        runTyping();
      }, 200);

      setTimeout(reveal, 10000); // failsafe timeout
    } else {
      reveal();
    }

    
  }
}
