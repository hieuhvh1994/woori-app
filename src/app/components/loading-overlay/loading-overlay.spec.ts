import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingOverlayComponent } from './loading-overlay';
import { LoadingService } from '../../core/loading';

describe('LoadingOverlayComponent', () => {
  let component: LoadingOverlayComponent;
  let fixture: ComponentFixture<LoadingOverlayComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingOverlayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingOverlayComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show overlay when loading', () => {
    loadingService.show();
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should hide overlay when not loading', () => {
    loadingService.hide();
    fixture.detectChanges();
    const overlay = fixture.nativeElement.querySelector('.loading-overlay');
    expect(overlay).toBeFalsy();
  });
});

