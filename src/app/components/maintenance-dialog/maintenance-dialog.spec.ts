import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MaintenanceDialogComponent } from './maintenance-dialog';

describe('MaintenanceDialogComponent', () => {
  let component: MaintenanceDialogComponent;
  let fixture: ComponentFixture<MaintenanceDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<MaintenanceDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MaintenanceDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when close button is clicked', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});

