import { Routes } from '@angular/router';
import { AuctionDetailComponent } from './routes/auction/auction-detail.component';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { NotFoundPageComponent } from './routes/not-found-page/not-found-page.component';
import { authRoutes } from './routes/auth/auth.routes';
import { CreateAuctionComponent } from './routes/create-auction/create-auction.component';

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
    path: 'auth',
    title: 'all auth routes',
    children: authRoutes,
  },
  {
    path: 'auction/:id',
    title: 'Lootopia Auction page',
    component: AuctionDetailComponent,
  },
  { 
    path: 'create/auction',
    title: 'Lootopia Create Auction page',
    component: CreateAuctionComponent, 
  },
  {
    path: '**',
    title: 'Lootopia not found page',
    component: NotFoundPageComponent,
  },
];
