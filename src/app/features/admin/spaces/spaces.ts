import { Component, inject, OnInit, viewChild } from '@angular/core';

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
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './spaces.html',
  styleUrl: './spaces.scss',
})
export class Spaces extends MCOdataTableComponent<Space> implements OnInit {
  override httpService = inject(SpacesService);
  private odataConverter = inject(MCFilterOdataConverterService);

  override tableKey = 'admin-spaces-table';
  filterConfig = new MCConfigFilter();

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
    super.ngOnInit();
    this.loadFilterConfig();
  }

  onFilter(filters: Array<MCResultFilter>) {
    let filterOdata = this.odataConverter.convert(filters);
    this.data.filters.cleanPostpend();
    this.data.filters.setPostpend(filterOdata);
    this.data.skip = 0;
    this.loadItems();
    console.log('filters', filters);
  }

  onSearch(event: Event) {
    this.data.skip = 0;
    this.searchFieldsKey.forEach((key) => {
      this.data.filters.addOrODataFilter(
        `substringof('${(event.target as HTMLInputElement).value}', ${key})`
      );
    });
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

  handleEdit(row: Space) {
    console.log(row);
  }
}
