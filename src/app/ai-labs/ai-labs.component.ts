import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationComponent } from '../navigation/navigation.component';
import { ResumeAIService, BulletPrediction } from '../services/resume-ai.service';

@Component({
  selector: 'app-ai-labs',
  standalone: true,
  imports: [NavigationComponent, CommonModule, FormsModule],
  templateUrl: './ai-labs.component.html',
  styleUrls: ['./ai-labs.component.scss']
})
export class AiLabsComponent implements AfterViewInit {
  // AI Analysis properties
  bulletText: string = '';
  prediction: BulletPrediction | null = null;
  isAnalyzing: boolean = false;
  error: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private resumeAIService: ResumeAIService
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use `document` now
      const loader = document.getElementById('app-loader');
      if (loader) {
        loader.style.display = 'none';
      }
    }
  }

  analyzeBullet(): void {
    if (!this.bulletText.trim()) {
      this.error = 'Please enter a bullet point to analyze.';
      return;
    }

    this.isAnalyzing = true;
    this.error = null;
    this.prediction = null;

    this.resumeAIService.predictBulletStrength(this.bulletText.trim()).subscribe({
      next: (result) => {
        this.prediction = result;
        this.isAnalyzing = false;
      },
      error: (err) => {
        this.error = 'Failed to analyze bullet point. Make sure the API server is running on http://localhost:8000';
        this.isAnalyzing = false;
        console.error('Analysis error:', err);
      }
    });
  }

  getLabelClass(label: string): string {
    switch (label?.toLowerCase()) {
      case 'strong':
        return 'label-strong';
      case 'medium':
        return 'label-medium';
      case 'weak':
        return 'label-weak';
      default:
        return '';
    }
  }

  getLabelDisplay(label: string): string {
    return label?.charAt(0).toUpperCase() + label?.slice(1) || 'Unknown';
  }

  clearAnalysis(): void {
    this.bulletText = '';
    this.prediction = null;
    this.error = null;
  }
}

