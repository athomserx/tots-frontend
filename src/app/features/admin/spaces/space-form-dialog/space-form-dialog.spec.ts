import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceFormDialog } from './space-form-dialog';

describe('SpaceFormDialog', () => {
  let component: SpaceFormDialog;
  let fixture: ComponentFixture<SpaceFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
