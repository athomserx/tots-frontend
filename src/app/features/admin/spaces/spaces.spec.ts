import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spaces } from './spaces';

describe('Spaces', () => {
  let component: Spaces;
  let fixture: ComponentFixture<Spaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spaces],
    }).compileComponents();

    fixture = TestBed.createComponent(Spaces);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const dateString = '2025-12-28T01:32:32.000000Z';
      const result = component.formatDate(dateString);
      expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
    });

    it('should return empty string for empty input', () => {
      const result = component.formatDate('');
      expect(result).toBe('');
    });

    it('should pad single digit day and month with zero', () => {
      const dateString = '2025-01-05T09:05:00.000000Z';
      const result = component.formatDate(dateString);
      expect(result).toContain('05-01-2025');
      expect(result).toContain('09:05');
    });
  });
});
