import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { PricingComponent } from '../pricing/pricing.component';
import { ToastService } from '../../shared/services/toast/toast.service';
import { DashboadComponent } from '../dashboad/dashboad.component';
import { ButtonModule } from 'primeng/button';
import { ChassesComponent } from '../chasses/chasses.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    Menu,
    BadgeModule,
    MessageModule,
    AvatarModule,
    PricingComponent,
    DashboadComponent,
    ButtonModule,
    ChassesComponent,
  ],
  standalone: true,
  providers: [MessageService, ToastService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  isDarkMode = false;
  items: MenuItem[] | undefined;
  user!: {
    nickname: string;
    access_token: string;
  };
  nickname = '';
  access_token = '';

  private router = inject(Router);

  // constructor() {}

  private showItemContent(item: string) {
    this.itemToShow = item;
    this.updateMenuItems();
  }

  private updateMenuItems() {
    this.items = [
      {
        label: 'Accueil',
        items: [
          {
            label: 'Tableau de bord',
            icon: 'pi pi-home',
            command: () => this.showItemContent('dashboard'),
            styleClass:
              this.itemToShow === 'dashboard' ? 'active-menu-item' : '',
          },
          {
            label: 'Mes artéfacts',
            icon: 'pi pi-box',
            command: () => this.showItemContent('artefacts'),
            styleClass:
              this.itemToShow === 'artefacts' ? 'active-menu-item' : '',
          },
        ],
      },
      {
        label: 'Chasse aux trésors',
        items: [
          {
            label: 'Mes chasses',
            icon: 'pi pi-compass',
            command: () => this.showItemContent('chasses'),
            styleClass: this.itemToShow === 'chasses' ? 'active-menu-item' : '',
          },
          {
            label: 'Organiser des chasses',
            icon: 'pi pi-map',
            command: () => this.showItemContent('creer-chasses'),
            styleClass:
              this.itemToShow === 'creer-chasses' ? 'active-menu-item' : '',
          },
          {
            label: 'Récompences',
            icon: 'pi pi-gift',
            command: () => this.showItemContent('recompences'),
            styleClass:
              this.itemToShow === 'recompences' ? 'active-menu-item' : '',
          },
        ],
      },
      {
        label: 'Marketplace',
        items: [
          {
            label: 'Acheter des couronnes',
            icon: 'pi pi-money-bill',
            command: () => this.showItemContent('pricing'),
            styleClass: this.itemToShow === 'pricing' ? 'active-menu-item' : '',
          },
          {
            label: 'Mes ventes',
            icon: 'pi pi-tag',
            command: () => this.showItemContent('ventes'),
            styleClass: this.itemToShow === 'ventes' ? 'active-menu-item' : '',
          },
        ],
      },
      {
        label: 'Support & Aide',
        items: [
          {
            label: 'FAQ',
            icon: 'pi pi-question-circle',
            command: () => this.showItemContent('faq'),
            styleClass: this.itemToShow === 'faq' ? 'active-menu-item' : '',
          },
          {
            label: 'contact',
            icon: 'pi pi-envelope',
            command: () => this.showItemContent('contact'),
            styleClass: this.itemToShow === 'contact' ? 'active-menu-item' : '',
          },
          {
            label: 'Confidentialités',
            icon: 'pi pi-lock',
            command: () => this.showItemContent('confidentialites'),
            styleClass:
              this.itemToShow === 'confidentialites' ? 'active-menu-item' : '',
          },
          {
            label: 'Conditions utilisateurs',
            icon: 'pi pi-file',
            command: () => this.showItemContent('conditions'),
            styleClass:
              this.itemToShow === 'conditions' ? 'active-menu-item' : '',
          },
        ],
      },
      {
        label: 'Administration',
        items: [
          {
            label: 'Gestion Admin',
            icon: 'pi pi-shield',
            command: () => this.showItemContent('admin'),
            styleClass: this.itemToShow === 'admin' ? 'active-menu-item' : '',
          },
        ],
      },
      {
        label: 'Paramètres',
        items: [
          {
            label: 'Mon profil',
            icon: 'pi pi-user',
            command: () => this.showItemContent('profile'),
            styleClass: this.itemToShow === 'profile' ? 'active-menu-item' : '',
          },
          {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            command: () => this.showItemContent('settings'),
            styleClass:
              this.itemToShow === 'settings' ? 'active-menu-item' : '',
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

  ngOnInit() {
    this.updateMenuItems();

    const userStr = localStorage.getItem('user') || '{}';
    this.user = JSON.parse(userStr);
    this.nickname = this.user.nickname;
    this.access_token = this.user.access_token;
  }

  itemToShow = 'dashboard';
  public toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
  }

  private handleLogout() {
    // Implémentez votre logique de déconnexion ici
    this.router.navigate(['/auth/login']);
  }
}
