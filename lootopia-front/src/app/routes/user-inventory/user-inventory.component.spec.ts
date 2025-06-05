import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInventoryComponent } from './user-inventory.component';
import { ArtefactService } from '../../shared/services/auction/artefact.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('UserInventoryComponent', () => {
  let component: UserInventoryComponent;
  let fixture: ComponentFixture<UserInventoryComponent>;
  let artefactServiceSpy: jasmine.SpyObj<ArtefactService>;

  const mockArtefacts = [
    {
      loot: { name: 'Boussole magique', rarity: 'Rare', image: '/img.png' },
      obtainedAt: new Date('2024-01-01'),
      obtentionMethod: 'chasses',
    },
    {
      loot: { name: 'Clé ancienne', rarity: 'Légendaire', image: '/img2.png' },
      obtainedAt: new Date('2024-05-01'),
      obtentionMethod: 'enchère',
    },
  ];

  beforeEach(async () => {
    artefactServiceSpy = jasmine.createSpyObj('ArtefactService', ['getAllMyArtefacts']);
    artefactServiceSpy.getAllMyArtefacts.and.returnValue(of(mockArtefacts));

    await TestBed.configureTestingModule({
      imports: [UserInventoryComponent, FormsModule, CommonModule],
      providers: [
        { provide: ArtefactService, useValue: artefactServiceSpy },
        ToastService,
        { provide: MessageService, useValue: {} }, // Mock MessageService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load artefacts', () => {
    expect(component).toBeTruthy();
    expect(component.artefacts.length).toBe(2);
    expect(component.filteredArtefacts.length).toBe(2);
  });

  it('should filter artefacts by name', () => {
    component.searchQuery = 'clé';
    component.filter();
    expect(component.filteredArtefacts.length).toBe(1);
    expect(component.filteredArtefacts[0].loot.name).toContain('Clé');
  });

  it('should filter artefacts by rarity', () => {
    component.rarityFilter = 'Rare';
    component.filter();
    expect(component.filteredArtefacts.length).toBe(1);
    expect(component.filteredArtefacts[0].loot.rarity).toBe('Rare');
  });

  it('should sort artefacts from newest to oldest', () => {
    component.sortOrder = 'recent';
    component.filter();
    expect(component.filteredArtefacts[0].loot.name).toBe('Clé ancienne');
  });

  it('should sort artefacts from oldest to newest', () => {
    component.sortOrder = 'oldest';
    component.filter();
    expect(component.filteredArtefacts[0].loot.name).toBe('Boussole magique');
  });
});
