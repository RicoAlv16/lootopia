import { Routes } from '@angular/router';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { NotFoundPageComponent } from './routes/not-found-page/not-found-page.component';
import { SidebarComponent } from './routes/sidebar/sidebar.component';
import { VerifyMailComponent } from './routes/auth/sigin/verify-mail/verify-mail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: 'Lootopia Home page',
    component: HomePageComponent,
  },
  {
    path: 'sidebar',
    title: 'Lootopia sidebar menu',
    component: SidebarComponent,
  },
  {
    path: 'verify-email/:token',
    title: 'Lootopia sidebar menu',
    component: VerifyMailComponent,
  },
  {
    path: '**',
    title: 'Lootopia not found page',
    component: NotFoundPageComponent,
  },
];
