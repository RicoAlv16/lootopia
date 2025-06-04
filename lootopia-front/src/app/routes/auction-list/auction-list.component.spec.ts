import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionListComponent } from './auction-list.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { ToastService } from '../../shared/services/toast/toast.service';

describe('AuctionListComponent', () => {
  let component: AuctionListComponent;
  let fixture: ComponentFixture<AuctionListComponent>;
  let mockAuctionService: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockAuctionService = {
      getAllAuctions: jasmine.createSpy().and.returnValue(of([])),
      getMyAuctions: jasmine.createSpy().and.returnValue(of([])),
      getFollowedAuctions: jasmine.createSpy().and.returnValue(of([])),
    };

    mockToastService = {
      showServerError: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, AuctionListComponent],
      providers: [
        { provide: AuctionService, useValue: mockAuctionService },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionListComponent);
    component = fixture.componentInstance;

    // Simuler un utilisateur dans localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) =>
      key === 'user' ? JSON.stringify({ id: 1 }) : null
    );

    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger toutes les enchères quand l’onglet est "all"', () => {
    component.setTab('all');
    expect(mockAuctionService.getAllAuctions).toHaveBeenCalled();
    expect(mockAuctionService.getFollowedAuctions).toHaveBeenCalled();
  });

  it('devrait charger mes enchères quand l’onglet est "mine"', () => {
    component.setTab('mine');
    expect(mockAuctionService.getMyAuctions).toHaveBeenCalled();
  });

  it('devrait charger les enchères suivies quand l’onglet est "followed"', () => {
    component.setTab('followed');
    expect(mockAuctionService.getFollowedAuctions).toHaveBeenCalled();
  });

  it('devrait appeler showServerError si l’utilisateur est absent du localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    component.setTab('all');
    expect(mockToastService.showServerError).toHaveBeenCalledWith('Utilisateur non connecté');
  });

  it('devrait filtrer les enchères par nom', () => {
    component.auctions = [
      {
        artefact: { loot: { name: 'Artefact A', rarity: 'Rare' } },
        currentBid: 100,
        isMine: true,
        isFollowed: false,
      },
      {
        artefact: { loot: { name: 'Artefact B', rarity: 'Épique' } },
        currentBid: 150,
        isMine: false,
        isFollowed: false,
      },
    ];
    component.searchName = 'Artefact A';
    component.filter();
    expect(component.filteredAuctions.length).toBe(1);
    expect(component.filteredAuctions[0].artefact.loot.name).toBe('Artefact A');
  });

  it('devrait ouvrir et fermer la modale de détails', () => {
    const fakeAuction = { artefact: { loot: {} } };
    component.openAuctionDetail(fakeAuction);
    expect(component.selectedAuction).toBe(fakeAuction);

    component.closeAuctionDetail();
    expect(component.selectedAuction).toBeNull();
  });

  it('devrait ouvrir et fermer le formulaire de création', () => {
    component.openCreateAuction();
    expect(component.showCreateForm).toBeTrue();

    component.closeCreateAuction();
    expect(component.showCreateForm).toBeFalse();
  });
});
