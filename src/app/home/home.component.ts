import {
  Component,
  AfterViewInit,
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
export class HomeComponent implements AfterViewInit {
  showLoader = false;

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

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const navigated = sessionStorage.getItem('navigated') === 'true';

    const reveal = () => {
      this.ngZone.run(() => {
        this.showLoader = false;
      });
    };

    const runTyping = async () => {
      const terminalText = document.getElementById('terminal-text');
      if (!terminalText) {
        console.error('terminalText element not found');
        reveal();
        return;
      }

      for (const line of this.typingText) {
        for (let i = 0; i <= line.length; i++) {
          terminalText.innerHTML = line.slice(0, i) + (i % 2 ? '_' : '');
          await new Promise((res) => setTimeout(res, 40));
        }
        terminalText.innerHTML += '<br>';
        await new Promise((res) => setTimeout(res, 600));
      }

      await new Promise((res) => setTimeout(res, 700));
      reveal();
    };

    if (!navigated) {
      this.ngZone.run(() => {
        this.showLoader = true;
        this.cd.detectChanges(); // force DOM update
      });

      setTimeout(() => {
        this.ngZone.run(async () => {
          await runTyping();
        });
      }, 0);

      setTimeout(reveal, 10000); // failsafe timeout
    } else {
      reveal();
    }

    sessionStorage.setItem('navigated', 'true');
  }
}
