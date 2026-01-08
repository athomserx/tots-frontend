import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Select } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';

import { SpacesService } from '@features/admin/spaces/spaces-service';
import { Space } from '@features/admin/spaces/space-types';
import { SPACE_TYPES } from '@core/models/space-description-model';
import { ReservationFormDialog } from '@features/admin/reservations/reservation-form-dialog/reservation-form-dialog';
import { ReservationsService } from '@features/admin/reservations/reservations-service';
import { Reservation } from '@features/admin/reservations/reservation-types';
import { ToastService } from '@shared/ui/toast/toast';

@Component({
  selector: 'tots-explore',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    Select,
    ReservationFormDialog,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore implements OnInit {
  private spacesService = inject(SpacesService);
  private reservationsService = inject(ReservationsService);
  private toastService = inject(ToastService);

  spaces = signal<Space[]>([]);
  filteredSpaces = signal<Space[]>([]);
  isLoading = signal(false);

  selectedSpaceType = signal<string | null>(null);
  spaceTypes = SPACE_TYPES;

  showDialog = signal(false);
  selectedSpace = signal<Space | null>(null);
  prefilledReservation = signal<Partial<Reservation> | null>(null);

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.isLoading.set(true);
    this.spacesService.list().subscribe({
      next: (response) => {
        this.spaces.set(response.data);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading spaces:', err);
        this.toastService.showError('Error', 'Failed to load spaces');
        this.isLoading.set(false);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.spaces()];

    if (this.selectedSpaceType()) {
      filtered = filtered.filter((s) => s.type === this.selectedSpaceType());
    }

    this.filteredSpaces.set(filtered);
  }

  onSpaceTypeFilterChange(spaceType: string | null) {
    this.selectedSpaceType.set(spaceType);
    this.applyFilters();
  }

  clearFilters() {
    this.selectedSpaceType.set(null);
    this.applyFilters();
  }

  openReservationDialog(space: Space) {
    // this.selectedSpace.set(space);
    // this.prefilledReservation.set({
    //   spaceId: space.id,
    // } as Partial<Reservation>);
    this.showDialog.set(true);
  }

  handleCloseDialog() {
    this.showDialog.set(false);
    this.selectedSpace.set(null);
    this.prefilledReservation.set(null);
  }

  handleSaveReservation(reservationData: Partial<Reservation>) {
    this.reservationsService.create(reservationData as Reservation).subscribe({
      next: () => {
        this.toastService.showSuccess('Success', 'Reservation created successfully');
        this.handleCloseDialog();
      },
      error: (err) => {
        console.error('Error creating reservation:', err);
        this.toastService.showError('Error', 'Failed to create reservation');
      },
    });
  }

  getSpaceTypeLabel(type: string): string {
    return this.spaceTypes.find((t) => t.value === type)?.label || type;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}/hr`;
  }
}
