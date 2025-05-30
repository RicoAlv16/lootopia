import { Component, inject, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { MessageModule } from 'primeng/message';
import { AvatarModule } from 'primeng/avatar';
import { PricingComponent } from '../pricing/pricing.component';
import { ToastService } from '../../shared/services/toast/toast.service';
import { DashboadComponent } from '../dashboad/dashboad.component';
import { ButtonModule } from 'primeng/button';
import { ChassesComponent } from '../chasses/chasses.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

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
    ModalComponent,
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
  couronnes = 0;
  nickname = '';
  access_token = '';
  paymentStatus = '';
  visiblePaymentStatusModal = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
          },
          {
            label: 'Mes artéfacts',
            icon: 'pi pi-box',
            command: () => this.showItemContent('artefacts'),
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
          },
          {
            label: 'Organiser des chasses',
            icon: 'pi pi-map',
            command: () => this.showItemContent('creer-chasses'),
          },
          {
            label: 'Récompences',
            icon: 'pi pi-gift',
            command: () => this.showItemContent('recompences'),
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
          },
          {
            label: 'Mes ventes',
            icon: 'pi pi-tag',
            command: () => this.showItemContent('ventes'),
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
          },
          {
            label: 'contact',
            icon: 'pi pi-envelope',
            command: () => this.showItemContent('contact'),
          },
          {
            label: 'Confidentialités',
            icon: 'pi pi-lock',
            command: () => this.showItemContent('confidentialites'),
          },
          {
            label: 'Conditions utilisateurs',
            icon: 'pi pi-file',
            command: () => this.showItemContent('conditions'),
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
          },
          {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            command: () => this.showItemContent('settings'),
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

    const payment = this.route.snapshot.paramMap.get('payment');
    if (payment) {
      this.visiblePaymentStatusModal = true;
      this.paymentStatus = payment;
    }
    const couronnes = localStorage.getItem('crowsPaid');
    if (couronnes) {
      console.log(payment === 'payment-success' && couronnes);
      this.couronnes = this.couronnes + (couronnes ? parseInt(couronnes) : 0);
    }
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
