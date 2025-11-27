import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ResumeComponent } from './resume/resume.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AiLabsComponent } from './ai-labs/ai-labs.component';

export const routes: Routes = [
{ path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'contact', component: ContactComponent},
  { path: 'ai-labs', component: AiLabsComponent}
  // Add more routes as needed
];
