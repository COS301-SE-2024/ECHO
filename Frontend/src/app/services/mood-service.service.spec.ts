import { TestBed } from '@angular/core/testing';

import { MoodServiceService } from './mood-service.service';

describe('MoodServiceService', () => {
  let service: MoodServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoodServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
