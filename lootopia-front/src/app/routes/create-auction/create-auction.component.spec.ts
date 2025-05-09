import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAuctionComponent } from './create-auction.component';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { ArtefactService } from '../../shared/services/auction/artefact.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateAuctionComponent', () => {
  let component: CreateAuctionComponent;
  let fixture: ComponentFixture<CreateAuctionComponent>;
  let auctionServiceSpy: jasmine.SpyObj<AuctionService>;
  let artefactServiceSpy: jasmine.SpyObj<ArtefactService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    auctionServiceSpy = jasmine.createSpyObj('AuctionService', ['createAuction']);
    artefactServiceSpy = jasmine.createSpyObj('ArtefactService', ['getMyArtefacts']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CreateAuctionComponent, // ✅ composant standalone
        FormsModule,
        HttpClientTestingModule, // ✅ pour HttpClient dans les services
      ],
      providers: [
        { provide: AuctionService, useValue: auctionServiceSpy },
        { provide: ArtefactService, useValue: artefactServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAuctionComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load artefacts on init', () => {
    const mockArtefacts = [{ id: 1, name: 'Amulette magique' }];
    artefactServiceSpy.getMyArtefacts.and.returnValue(of(mockArtefacts));

    component.ngOnInit();

    expect(component.artefacts).toEqual(mockArtefacts);
  });

  it('should alert on missing form fields', () => {
    spyOn(window, 'alert');
    component.selectedArtefactId = null;
    component.startingPrice = 0;

    component.createAuction();

    expect(window.alert).toHaveBeenCalledWith('Veuillez remplir tous les champs.');
    expect(auctionServiceSpy.createAuction).not.toHaveBeenCalled();
  });

  it('should call auctionService.createAuction on valid form', () => {
    component.selectedArtefactId = 1;
    component.startingPrice = 100;
    component.durationInMinutes = 60;

    auctionServiceSpy.createAuction.and.returnValue(of({ id: 1 }));

    component.createAuction();

    expect(auctionServiceSpy.createAuction).toHaveBeenCalledWith({
      artefactId: 1,
      startingPrice: 100,
      durationInMinutes: 60,
    });
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should alert on error from service', () => {
    spyOn(window, 'alert');
    component.selectedArtefactId = 1;
    component.startingPrice = 100;
    component.durationInMinutes = 60;

    auctionServiceSpy.createAuction.and.returnValue(
      throwError(() => new Error('Erreur serveur')),
    );

    component.createAuction();

    expect(window.alert).toHaveBeenCalled();
  });
});
