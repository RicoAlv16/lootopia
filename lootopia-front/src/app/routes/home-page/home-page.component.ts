import { Component } from '@angular/core';
import { LoginComponent } from '../auth/login/login.component';
import { SiginComponent } from '../auth/sigin/sigin.component';

@Component({
  selector: 'app-home-page',
  imports: [LoginComponent, SiginComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  visible = false;
  visibleSign = false;

  showDialog() {
    this.visible = true;
    console.log('Le visible est : ' + this.visible);
  }

  showSiginDialog() {
    this.visibleSign = true;
    console.log('Le visible Sign est : ' + this.visibleSign);
  }
}
