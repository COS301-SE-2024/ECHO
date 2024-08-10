import { TestBed } from '@angular/core/testing';

import { MoodService } from './mood-service.service';

describe('MoodServiceService', () => {
  let service: MoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
