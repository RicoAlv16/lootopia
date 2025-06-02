import { Routes } from '@angular/router';
import { AuctionDetailComponent } from './routes/auction/auction-detail.component';
import { HomePageComponent } from './routes/home-page/home-page.component';
import { NotFoundPageComponent } from './routes/not-found-page/not-found-page.component';
import { CreateAuctionComponent } from './routes/create-auction/create-auction.component';
import { AuctionListComponent } from './routes/auction-list/auction-list.component'
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
    path: 'sidebar/:payment',
    title: 'Lootopia sidebar menu',
    component: SidebarComponent,
  },
  {
    path: 'verify-email/:token',
    title: 'Lootopia sidebar menu',
    component: VerifyMailComponent,
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
    path: 'auctions',
    title: 'Lootopia Auctions page',
    component: AuctionListComponent,
  },
  {
    path: '**',
    title: 'Lootopia not found page',
    component: NotFoundPageComponent,
  },
];
