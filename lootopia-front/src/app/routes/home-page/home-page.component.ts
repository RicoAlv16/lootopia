import { Component } from '@angular/core';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-home-page',
  imports: [LoginComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  visible = false;
  showDialog() {
    this.visible = true;
    console.log('Le visible est : ' + this.visible);
  }
}
