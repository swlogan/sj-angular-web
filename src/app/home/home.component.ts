import { Component } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ NavigationComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
