import { TestBed } from '@angular/core/testing';

import { CheckValidUserService } from './check-valid-user.service';

describe('CheckValidUserService', () => {
  let service: CheckValidUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckValidUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
