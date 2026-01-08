import { Component, inject, input, output, signal, effect, OnInit, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';

import { Reservation, ReservationType } from '@features/admin/reservations/reservation-types';
import { SpacesService } from '@features/admin/spaces/spaces-service';
import { Space } from '@features/admin/spaces/space-types';

@Component({
  selector: 'tots-reservation-form-dialog',
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, Select, DatePicker, InputText],
  templateUrl: './reservation-form-dialog.html',
  styleUrl: './reservation-form-dialog.scss',
})
export class ReservationFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private spacesService = inject(SpacesService);

  visible = input<boolean>(false);
  reservation = input<Partial<Reservation> | null>(null);
  mode = input<'add' | 'edit'>('add');
  isClientMode = input<boolean>(false);

  onClose = output<void>();
  onSave = output<Partial<Reservation>>();

  spaces = signal<Space[]>([]);
  reservationTypes = [
    { label: 'Block', value: ReservationType.Block },
    { label: 'Client Reservation', value: ReservationType.Booking },
  ];

  reservationForm = this.fb.group({
    spaceId: [null as number | null, [Validators.required]],
    type: [ReservationType.Block as ReservationType, [Validators.required]],
    start: [null as Date | null, [Validators.required]],
    end: [null as Date | null, [Validators.required]],
    eventName: [null as string | null],
  });

  constructor() {
    effect(() => {
      const currentReservation = this.reservation();
      const isClient = this.isClientMode();
      const currentMode = this.mode();

      untracked(() => {
        if (currentReservation && currentMode === 'edit') {
          this.reservationForm.patchValue({
            spaceId: currentReservation.spaceId,
            type: currentReservation.type,
            start: currentReservation.start ? new Date(currentReservation.start) : null,
            end: currentReservation.end ? new Date(currentReservation.end) : null,
            eventName: currentReservation.eventName || null,
          });
        } else if (currentMode === 'add') {
          // Reset form with default values
          this.reservationForm.reset({
            type: isClient ? ReservationType.Booking : ReservationType.Block,
            eventName: null,
            spaceId: null,
            start: null,
            end: null,
          });

          if (currentReservation) {
            this.reservationForm.patchValue({
              spaceId: currentReservation.spaceId || null,
            });
          }
        }
      });
    });
  }

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.spacesService.list().subscribe({
      next: (response) => {
        this.spaces.set(response.data);
      },
      error: (err) => {
        console.error('Error loading spaces:', err);
      },
    });
  }

  get dialogTitle(): string {
    return this.mode() === 'add' ? 'Add New Reservation' : 'Edit Reservation';
  }

  get submitButtonLabel(): string {
    return this.mode() === 'add' ? 'Create Reservation' : 'Update Reservation';
  }

  handleClose() {
    this.reservationForm.reset({
      type: this.isClientMode() ? ReservationType.Booking : ReservationType.Block,
      eventName: null,
    });
    this.onClose.emit();
  }

  handleSubmit() {
    if (this.reservationForm.invalid) {
      ``;
      this.reservationForm.markAllAsTouched();
      return;
    }

    const formValue = this.reservationForm.getRawValue();
    const reservationData: Partial<Reservation> = {
      spaceId: formValue.spaceId!,
      start: formValue.start!.toISOString(),
      end: formValue.end!.toISOString(),
      userId: 1, // TODO: Get from current user
    };

    if (!this.isClientMode()) {
      reservationData.type = formValue.type!;
    } else {
      reservationData.type = ReservationType.Booking;
    }

    if (formValue.eventName) {
      reservationData.eventName = formValue.eventName;
    }

    if (this.mode() === 'edit' && this.reservation()) {
      reservationData.id = this.reservation()!.id;
    }

    this.onSave.emit(reservationData);
  }

  getErrorMessage(fieldName: string): string | null {
    const control = this.reservationForm.get(fieldName);
    if (!control?.invalid || !control?.touched) return null;

    if (control.errors?.['required']) return `${fieldName} is required`;

    return 'Invalid value';
  }

  getSpaceName(spaceId: number): string {
    return this.spaces().find((s) => s.id === spaceId)?.name || 'Unknown';
  }
}
