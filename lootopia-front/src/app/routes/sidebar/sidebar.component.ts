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
import { ChassesAuxTresorsComponent } from '../chasses-aux-tresors/chasses-aux-tresors.component';
import { MesChassesComponent } from '../mes-chasses/mes-chasses.component';
import { DashboardData, DashboardService } from '../dashboad/dashboard.service';
import { ProfilesComponent } from '../profiles/profiles.component';
import { AuctionListComponent } from '../auction-list/auction-list.component'; 
import { UserInventoryComponent } from '../user-inventory/user-inventory-component';
import { ToastModule } from 'primeng/toast';

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
    ChassesAuxTresorsComponent,
    MesChassesComponent,
    ProfilesComponent,
    AuctionListComponent,
    UserInventoryComponent,
    ToastModule

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
    email: string;
    access_token: string;
  };
  couronnes = 0;
  artifactsCount = 0;
  nickname = '';
  email = '';
  access_token = '';
  paymentStatus = '';
  visiblePaymentStatusModal = false;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dashboardService = inject(DashboardService);

  // constructor() {}

  private showItemContent(item: string) {
    this.itemToShow = item;
    this.updateMenuItems();
  }
  private isAdmin(): boolean {
    return false;
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
          {
            label: 'Récompences',
            icon: 'pi pi-gift',
            command: () => this.showItemContent('recompences'),
          },
        ],
      },
      {
        label: 'Chasse aux trésors',
        items: [
          {
            label: 'Chasses aux trésors',
            icon: 'pi pi-discord',
            command: () => this.showItemContent('chasses-aux-tresors'),
          },
          {
            label: 'Mes chasses',
            icon: 'pi pi-compass',
            command: () => this.showItemContent('mes-chasses'),
          },
          {
            label: 'Organiser des chasses',
            icon: 'pi pi-map',
            command: () => this.showItemContent('creer-chasses'),
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
            label: 'Hôtel de ventes',
            icon: 'pi pi-tag',
            command: () => this.showItemContent('hotel-de-ventes'),
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
            disabled: !this.isAdmin(),
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
            command: () => this.showItemContent('profiles'),
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
    this.email = this.user.email;
    this.access_token = this.user.access_token;

    const payment = this.route.snapshot.paramMap.get('payment');
    if (payment) {
      this.visiblePaymentStatusModal = true;
      this.paymentStatus = payment;
    }

    this.loadDashboardData();

    const couronnes = localStorage.getItem('crowsPaid');

    if (couronnes && payment === 'payment-success') {
      const additionalCrowns = parseInt(couronnes);
      this.addCrowns(additionalCrowns, this.email);
      localStorage.removeItem('crowsPaid'); // Nettoyer après utilisation
    }
  }

  private loadDashboardData() {
    this.dashboardService.getDashboardData(this.email).subscribe({
      next: (data: DashboardData) => {
        this.couronnes = data.crowns;
        this.artifactsCount = data.artifactsCount;
      },
      error: error => {
        console.error(
          'Erreur lors du chargement des données du dashboard:',
          error
        );
      },
    });
  }

  // Méthodes pour mettre à jour les données
  addCrowns(crowns: number, email: string) {
    this.dashboardService.addCrowns(crowns, email).subscribe({
      next: () => {
        this.couronnes += crowns;
      },
      error: error => {
        console.error("Erreur lors de l'ajout des couronnes:", error);
      },
    });
  }

  itemToShow = 'dashboard';
  public toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const element = document.querySelector('html');
    element?.classList.toggle('dark-mode');
  }

  private handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('createdHunts');
    localStorage.removeItem('crowsPaid');
    this.router.navigate(['/home']);
  }
}
