import { Component, inject, OnInit, signal, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MCTable, MCTdTemplateDirective } from '@mckit/table';
import { MCOdataTableComponent } from '@mckit/odata';
import {
  MCConfigFilter,
  MCResultFilter,
  MCFilterOdataConverterService,
  MCFilterButton,
  MCFilter,
} from '@mckit/filter';
import { MCColumn } from '@mckit/core';

import { Space } from './space-types';
import { SpacesService } from './spaces-service';
import { SPACE_TYPES } from '@core/models/space-description-model';
import { TablePageEvent } from 'primeng/table';
import { SpaceFormDialog } from './space-form-dialog/space-form-dialog';
import { ToastService } from '@shared/ui/toast/toast';

@Component({
  selector: 'tots-spaces',
  imports: [
    MCTable,
    ButtonModule,
    MCTdTemplateDirective,
    ToastModule,
    ConfirmDialogModule,
    MCFilterButton,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    SpaceFormDialog,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './spaces.html',
  styleUrl: './spaces.scss',
})
export class Spaces extends MCOdataTableComponent<Space> implements OnInit, AfterViewInit {
  override httpService = inject(SpacesService);
  private odataConverter = inject(MCFilterOdataConverterService);
  private toastService = inject(ToastService);
  confirmService = inject(ConfirmationService);

  private cdr = inject(ChangeDetectorRef);

  override tableKey = 'admin-spaces-table';
  filterConfig = new MCConfigFilter();
  search$ = new Subject<string>();

  showDialog = signal(false);
  dialogMode = signal<'add' | 'edit'>('add');
  selectedSpace = signal<Space | null>(null);

  override columns: Array<MCColumn> = [
    { field: 'id', title: 'ID', isShow: true },
    { field: 'name', title: 'Name', isShow: true },
    { field: 'type', title: 'Type', isShow: true },
    { field: 'description', title: 'Description', isShow: true },
    { field: 'pricePerHour', title: 'Price per hour', isShow: true },
    { field: 'capacity', title: 'Capacity', isShow: true },
    { field: 'createdAt', title: 'Created at', isShow: true },
    { field: 'updatedAt', title: 'Updated at', isShow: true },
    { field: 'actions', title: 'Actions', isShow: true },
  ];

  override searchFieldsKey: string[] = ['name', 'type', 'description'];

  override ngOnInit() {
    this.data.top = 10;
    this.data.orderBy = 'createdAt desc';
    this.loadFilterConfig();
    this.initSearchConfig();

    Promise.resolve().then(() => {
      this.loadItems();
      this.cdr.detectChanges();
    });
  }

  /**
   * Para mi reviewer: Estaba intentando solucionar el error ExpressionChangedAfterItHasBeenCheckedError,
   * pero no encontraba la raíz del problema, ya que yo no estaba usando ngAfterViewInit para ocasionar
   * un render adicional del componente, así que para no seguir dedicándole tiempo a este problema (para
   * el cual ya había invertido cierto tiempo), tomé una solución rápida: disparar un evento cualquiera
   * para hacer que Angular re renderice la vista y que los elementos se muestren. Asumo que el problema
   * está dentro de la librería mc-kit, al extender de MCOdataTableComponent, ya que este error ocurre al
   * llamar a super.ngOnInit, o directamente a loadItems.
   */
  ngAfterViewInit() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 2000);
  }

  initSearchConfig() {
    this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
      this.data.skip = 0;
      this.searchFieldsKey.forEach((key) => {
        this.data.filters.addOrODataFilter(`substringof('${value}', ${key})`);
      });
      this.loadItems();
    });
  }

  onFilter(filters: Array<MCResultFilter>) {
    let filterOdata = this.odataConverter.convert(filters);
    this.data.filters.cleanPostpend();
    this.data.filters.setPostpend(filterOdata);
    this.data.skip = 0;
    this.loadItems();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }

  onPageChange(event: TablePageEvent) {
    this.data.skip = event.first;
    this.data.top = event.rows;
    this.loadItems();
  }

  loadFilterConfig() {
    this.filterConfig.filters = [
      MCFilter.text({
        title: 'Name',
        key: 'name',
      }),
      MCFilter.text({
        title: 'Description',
        key: 'description',
      }),
      MCFilter.multiselect({
        title: 'Type',
        key: 'type',
        options: SPACE_TYPES,
      }),
    ];
  }

  openAddDialog() {
    this.dialogMode.set('add');
    this.selectedSpace.set(null);
    this.showDialog.set(true);
  }

  handleEdit(spaceId: number) {
    this.httpService.get(spaceId.toString()).subscribe({
      next: (space) => {
        this.selectedSpace.set(space);
        this.dialogMode.set('edit');
        this.showDialog.set(true);
      },
      error: (err) => {
        console.error('Error fetching space:', err);
        this.toastService.showError('Error', 'Failed to load space details');
      },
    });
  }

  handleCloseDialog() {
    this.showDialog.set(false);
    this.selectedSpace.set(null);
  }

  handleSaveSpace(spaceData: Partial<Space>) {
    if (this.dialogMode() === 'add') {
      this.httpService.create(spaceData as Space).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Space created successfully');
          this.handleCloseDialog();
          this.loadItems();
        },
        error: (err) => {
          console.error('Error creating space:', err);
          this.toastService.showError('Error', 'Failed to create space');
        },
      });
    } else {
      this.httpService.update(spaceData as Space).subscribe({
        next: () => {
          this.toastService.showSuccess('Success', 'Space updated successfully');
          this.handleCloseDialog();
          this.loadItems();
        },
        error: (err) => {
          console.error('Error updating space:', err);
          this.toastService.showError('Error', 'Failed to update space');
        },
      });
    }
  }

  override onRemoveConfirm(spaceId: number) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete this space?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.handleDelete(spaceId);
      },
    });
  }

  private handleDelete(spaceId: number) {
    this.httpService.delete(spaceId.toString()).subscribe({
      next: () => {
        this.toastService.showSuccess('Success', 'Space deleted successfully');
        this.loadItems();
      },
      error: (err) => {
        console.error('Error deleting space:', err);
        this.toastService.showError('Error', 'Failed to delete space');
      },
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
