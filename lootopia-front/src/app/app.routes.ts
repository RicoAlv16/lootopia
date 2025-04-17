import { Routes } from '@angular/router';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { NotFoundPageComponent } from './routes/not-found-page/not-found-page.component';

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
    path: '**',
    title: 'Lootopia not found page',
    component: NotFoundPageComponent,
  },
];
