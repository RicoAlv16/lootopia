import { Routes } from '@angular/router';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { NotFoundPageComponent } from './routes/not-found-page/not-found-page.component';
import { authRoutes } from './routes/auth/auth.routes';
import { SidebarComponent } from './routes/sidebar/sidebar.component';
import { PricingComponent } from './routes/pricing/pricing.component';

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
    path: 'pricing',
    title: 'Lootopia pricing page',
    component: PricingComponent,
  },
  {
    path: 'auth',
    title: 'all auth routes',
    children: authRoutes,
  },
  {
    path: '**',
    title: 'Lootopia not found page',
    component: NotFoundPageComponent,
  },
];
