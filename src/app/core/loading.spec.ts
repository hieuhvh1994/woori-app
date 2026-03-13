import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show loading', () => {
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should hide loading', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should auto hide after duration', (done) => {
    service.show(100);
    expect(service.isLoading()).toBe(true);

    setTimeout(() => {
      expect(service.isLoading()).toBe(false);
      done();
    }, 150);
  });
});

