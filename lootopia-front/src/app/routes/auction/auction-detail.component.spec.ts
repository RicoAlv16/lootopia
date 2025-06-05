import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionDetailComponent } from './auction-detail.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuctionService } from '../../shared/services/auction/auction.service';
import { AuthService } from '../../shared/services/auth/auth.services';
import { ToastService } from '../../shared/services/toast/toast.service';
import { of, throwError } from 'rxjs';

describe('AuctionDetailComponent', () => {
  let component: AuctionDetailComponent;
  let fixture: ComponentFixture<AuctionDetailComponent>;
  let mockAuctionService: any;
  let mockAuthService: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockAuctionService = {
      placeBid: jasmine.createSpy('placeBid'),
      followAuction: jasmine.createSpy('followAuction'),
      unfollowAuction: jasmine.createSpy('unfollowAuction'),
      getFollowedAuctions: jasmine.createSpy('getFollowedAuctions').and.returnValue(of([]))
    };

    mockAuthService = {
      getUserId: jasmine.createSpy('getUserId').and.returnValue(1)
    };

    mockToastService = {
      showSuccess: jasmine.createSpy('showSuccess'),
      showServerError: jasmine.createSpy('showServerError')
    };

    await TestBed.configureTestingModule({
      // ✅ Mettre les composants standalone dans "imports", pas "declarations"
      imports: [AuctionDetailComponent, CommonModule, FormsModule],
      providers: [
        { provide: AuctionService, useValue: mockAuctionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionDetailComponent);
    component = fixture.componentInstance;
    component.auction = {
      id: 1,
      currentBid: 50,
      artefact: {
        loot: {
          name: 'Test Artefact',
          image: '/fake.png',
          rarity: 'Rare',
          description: 'Test Description'
        }
      },
      endTime: new Date(Date.now() + 60000).toISOString(),
      startingPrice: 30
    };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct bid amount', () => {
    component.updateBidAmount();
    expect(component.bidAmount).toBe(51);
  });

  it('should call placeBid and show success', () => {
    mockAuctionService.placeBid.and.returnValue(of({}));
    component.placeBid();
    expect(mockAuctionService.placeBid).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalled();
  });

  it('should handle error on placeBid', () => {
    mockAuctionService.placeBid.and.returnValue(throwError(() => ({
      error: { message: 'Erreur API' }
    })));
    component.placeBid();
    expect(mockToastService.showServerError).toHaveBeenCalledWith(
      jasmine.stringMatching(/Erreur d'enchère/)
    );
  });

  it('should toggle follow and call service', () => {
    mockAuctionService.followAuction.and.returnValue(of({}));
    component.isFollowed = false;
    component.toggleFollow();
    expect(mockAuctionService.followAuction).toHaveBeenCalled();
  });
});
