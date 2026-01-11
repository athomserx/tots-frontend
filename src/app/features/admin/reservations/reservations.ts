import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Select } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ReservationsService } from './reservations-service';
import { Reservation, ReservationType } from './reservation-types';
import { ReservationFormDialog } from './reservation-form-dialog/reservation-form-dialog';
import { ToastService } from '@shared/ui/toast/toast';
import { SpacesService } from '../spaces/spaces-service';
import { Space } from '../spaces/space-types';
import { SPACE_TYPES } from '@core/models/space-description-model';

@Component({
  selector: 'tots-reservations',
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
  templateUrl: './reservations.html',
  styleUrl: './reservations.scss',
})
export class Reservations implements OnInit {
  private reservationsService = inject(ReservationsService);
  private spacesService = inject(SpacesService);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);

  reservations = signal<Reservation[]>([]);
  filteredReservations = signal<Reservation[]>([]);
  spaces = signal<Space[]>([]);
  isLoading = signal(false);
  actionError = signal<string | null>(null);

  // Filters
  selectedSpaceId = signal<number | null>(null);
  selectedSpaceType = signal<string | null>(null);
  spaceTypes = SPACE_TYPES;

  // Dialog state
  showDialog = signal(false);
  dialogMode = signal<'add' | 'edit'>('add');
  selectedReservation = signal<Reservation | null>(null);

  ngOnInit() {
    this.loadSpaces();
    this.loadReservations();
  }

  loadSpaces() {
    this.spacesService.list().subscribe({
      next: (response) => {
        this.spaces.set(response.data);
      },
      error: (err) => {
        console.error('Error loading spaces:', err);
        this.toastService.showError('Error', 'Failed to load spaces');
      },
    });
  }

  loadReservations() {
    this.isLoading.set(true);
    this.reservationsService.list().subscribe({
      next: (response) => {
        this.reservations.set(response.data);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.toastService.showError('Error', 'Failed to load reservations');
        this.isLoading.set(false);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.reservations()];

    // Filter by space ID
    if (this.selectedSpaceId()) {
      filtered = filtered.filter((r) => r.spaceId === this.selectedSpaceId());
    }

    // Filter by space type
    if (this.selectedSpaceType()) {
      const spacesOfType = this.spaces()
        .filter((s) => s.type === this.selectedSpaceType())
        .map((s) => s.id);
      filtered = filtered.filter((r) => spacesOfType.includes(r.spaceId));
    }

    this.filteredReservations.set(filtered);
  }

  onSpaceFilterChange(spaceId: number | null) {
    this.selectedSpaceId.set(spaceId);
    this.applyFilters();
  }

  onSpaceTypeFilterChange(spaceType: string | null) {
    this.selectedSpaceType.set(spaceType);
    this.applyFilters();
  }

  clearFilters() {
    this.selectedSpaceId.set(null);
    this.selectedSpaceType.set(null);
    this.applyFilters();
  }

  openAddDialog() {
    this.dialogMode.set('add');
    this.selectedReservation.set(null);
    this.showDialog.set(true);
  }

  handleEdit(reservationId: number) {
    this.reservationsService.get(reservationId.toString()).subscribe({
      next: (reservation) => {
        this.selectedReservation.set(reservation);
        this.dialogMode.set('edit');
        this.showDialog.set(true);
      },
      error: (err) => {
        console.error('Error fetching reservation:', err);
        this.toastService.showError('Error', 'Failed to load reservation details');
      },
    });
  }

  handleCloseDialog() {
    this.showDialog.set(false);
    this.selectedReservation.set(null);
  }

  handleSaveReservation(reservationData: Partial<Reservation>) {
    if (this.dialogMode() === 'add') {
      this.reservationsService.create(reservationData as Reservation).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Reservation created successfully');
          this.handleCloseDialog();
          this.loadReservations();
        },
        error: (err) => {
          this.actionError.set(err.error.message);
          console.log('error', err.error);
          this.toastService.showError('Error', 'Failed to create reservation');
        },
      });
    } else {
      this.reservationsService.update(reservationData as Reservation).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Reservation updated successfully');
          this.handleCloseDialog();
          this.loadReservations();
        },
        error: (err) => {
          console.error('Error updating reservation:', err);
          this.toastService.showError('Error', 'Failed to update reservation');
        },
      });
    }
  }

  onRemoveConfirm(reservationId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this reservation?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.handleDelete(reservationId);
      },
    });
  }

  private handleDelete(reservationId: number) {
    this.reservationsService.delete(reservationId.toString()).subscribe({
      next: () => {
        this.toastService.showSuccess('Success', 'Reservation deleted successfully');
        this.loadReservations();
      },
      error: (err) => {
        console.error('Error deleting reservation:', err);
        this.toastService.showError('Error', 'Failed to delete reservation');
      },
    });
  }

  getSpaceName(spaceId: number): string {
    return this.spaces().find((s) => s.id === spaceId)?.name || 'Unknown Space';
  }

  getReservationTypeLabel(type: ReservationType): string {
    return type === ReservationType.Block ? 'Block' : 'Client Reservation';
  }

  getReservationTypeBadgeClass(type: ReservationType): string {
    return type === ReservationType.Block ? 'badge-block' : 'badge-client';
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
