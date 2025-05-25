import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { PricingComponent } from '../pricing/pricing.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { Toast } from 'primeng/toast';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    Menu,
    BadgeModule,
    MessageModule,
    AvatarModule,
    PricingComponent,
    HomePageComponent,
    Toast,
  ],
  standalone: true,
  providers: [MessageService, ToastService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Accueil',
        items: [
          {
            label: 'Tableau de bord',
            icon: 'pi pi-home',
            command: () => this.showItemContent('dashboard'),
          },
          {
            label: 'Mes collections',
            icon: 'pi pi-box',
            command: () => this.showItemContent('pricing'),
          },
        ],
      },
      {
        label: 'Marketplace',
        items: [
          {
            label: 'Explorer',
            icon: 'pi pi-search',
            command: () => this.router.navigate(['/marketplace']),
          },
          {
            label: 'Mes ventes',
            icon: 'pi pi-shopping-cart',
            command: () => this.router.navigate(['/my-sales']),
          },
        ],
      },
      {
        label: 'Paramètres',
        items: [
          {
            label: 'Mon profil',
            icon: 'pi pi-user',
            command: () => this.router.navigate(['/profile']),
          },
          {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            command: () => this.router.navigate(['/settings']),
          },
          {
            label: 'Déconnexion',
            icon: 'pi pi-sign-out',
            command: () => this.handleLogout(),
          },
        ],
      },
    ];
  }

  itemToShow = 'home';
  private showItemContent(item: string) {
    this.itemToShow = item;
  }

  private handleLogout() {
    // Implémentez votre logique de déconnexion ici
    this.router.navigate(['/auth/login']);
  }
}
