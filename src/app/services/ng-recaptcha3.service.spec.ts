import { TestBed, inject } from '@angular/core/testing';

import { NgRecaptcha3Service } from './ng-recaptcha3.service';

describe('NgRecaptcha3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgRecaptcha3Service]
    });
  });

  it('should be created', inject([NgRecaptcha3Service], (service: NgRecaptcha3Service) => {
    expect(service).toBeTruthy();
  }));
});
