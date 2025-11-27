import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BulletPrediction {
  label: string;
  confidence: number;
}

export interface BulletRequest {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeAIService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  predictBulletStrength(text: string): Observable<BulletPrediction> {
    return this.http.post<BulletPrediction>(
      `${this.apiUrl}/predict`,
      { text } as BulletRequest
    );
  }

  predictBatch(bullets: string[]): Observable<{ predictions: Array<BulletPrediction & { text: string }> }> {
    const requests = bullets.map(text => ({ text }));
    return this.http.post<{ predictions: Array<BulletPrediction & { text: string }> }>(
      `${this.apiUrl}/predict/batch`,
      requests
    );
  }

  healthCheck(): Observable<{ status: string; model_loaded: boolean }> {
    return this.http.get<{ status: string; model_loaded: boolean }>(
      `${this.apiUrl}/health`
    );
  }
}


