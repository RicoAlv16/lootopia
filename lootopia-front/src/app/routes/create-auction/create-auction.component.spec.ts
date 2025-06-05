import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateAuctionComponent } from './create-auction.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { ArtefactService } from '../../shared/services/auction/artefact.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { Router } from '@angular/router';

describe('CreateAuctionComponent', () => {
  let component: CreateAuctionComponent;
  let fixture: ComponentFixture<CreateAuctionComponent>;

  const mockArtefactService = {
    getMyArtefacts: jasmine.createSpy().and.returnValue(of([
      { id: 1, loot: { name: 'Artefact Test', image: '/test.png' } }
    ]))
  };

  const mockAuctionService = {
    createAuction: jasmine.createSpy().and.returnValue(of({}))
  };

  const mockToastService = {
    showServerError: jasmine.createSpy(),
    showSuccess: jasmine.createSpy()
  };

  const mockRouter = {
    navigate: jasmine.createSpy()
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ id: 1 }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, CreateAuctionComponent],
      providers: [
        { provide: ArtefactService, useValue: mockArtefactService },
        { provide: AuctionService, useValue: mockAuctionService },
        { provide: ToastService, useValue: mockToastService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les artéfacts au démarrage', () => {
    expect(mockArtefactService.getMyArtefacts).toHaveBeenCalled();
    expect(component.artefacts.length).toBe(1);
  });

  it('devrait sélectionner un artéfact correctement', () => {
    component.selectedArtefactId = 1;
    component.onArtefactChange();
    expect(component.selectedArtefact?.id).toBe(1);
  });

  it('ne devrait pas créer l’enchère si un champ est vide', () => {
    component.selectedArtefactId = null;
    component.startingPrice = 0;
    component.createAuction();
    expect(mockToastService.showServerError).toHaveBeenCalledWith('Veuillez remplir tous les champs.');
  });

  it('devrait appeler createAuction et afficher un succès', fakeAsync(() => {
    component.selectedArtefactId = 1;
    component.startingPrice = 100;
    component.durationInMinutes = 60;
    component.userId = 1;
  
    component.createAuction();
  
    expect(mockAuctionService.createAuction).toHaveBeenCalledWith({
      artefactId: 1,
      startingPrice: 100,
      durationInMinutes: 60
    });
    
    tick(); // Simule l'écoulement du temps pour résoudre l'Observable
    
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Enchère créée avec succès !');
  }));

  it('devrait afficher une erreur si createAuction échoue', () => {
    mockAuctionService.createAuction.and.returnValue(throwError(() => ({
      error: { message: 'Erreur côté serveur' }
    })));

    component.selectedArtefactId = 1;
    component.startingPrice = 50;
    component.durationInMinutes = 30;
    component.userId = 1;

    component.createAuction();
    expect(mockToastService.showServerError).toHaveBeenCalledWith('Erreur côté serveur');
  });
});
