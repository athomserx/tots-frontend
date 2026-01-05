import { Component, inject, OnInit, viewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MCTable, MCTdTemplateDirective } from '@mckit/table'
import { MCOdataTableComponent } from '@mckit/odata';
import { MCFilter, MCConfigFilter, MCResultFilter, MCFilterOdataConverterService } from '@mckit/filter';
import { MCColumn, MCListResponse } from '@mckit/core';

import { Space } from './space-types';
import { SpacesService } from './spaces-service';

@Component({
  selector: 'tots-spaces',
  imports: [MCTable, ButtonModule, MCTdTemplateDirective],
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
    { field: 'actions', title: 'Actions', isShow: true }
  ];

  override searchFieldsKey: string[] = ['name', 'type', 'description'];

  override ngOnInit() {
    this.data.top = 10;
    this.data.orderBy = 'createdAt desc';
    super.ngOnInit();
    // this.loadFilterConfig();
  }

  onFilter(filters: Array<MCResultFilter>) {
    let filterOdata = this.odataConverter.convert(filters);
    this.data.filters.cleanPostpend();
    this.data.filters.setPostpend(filterOdata);
    this.data.skip = 0;
    this.loadItems();
  }

  // loadFilterConfig() {
  //   this.filterConfig.filters = [
  //     MCFilter.text({
  //       title: 'Name',
  //       key: 'name',
  //     }),
  //     MCFilter.multiselect({
  //       title: 'Type',
  //       key: 'type',
  //       options: [
  //         { label: 'Room', value: 'Room' },
  //         { label: 'Room with Kitchen', value: 'Room with Kitchen' },
  //         { label: 'Room with Bathroom', value: 'Room with Bathroom' },
  //         { label: 'Room with Kitchen and Bathroom', value: 'Room with Kitchen and Bathroom' },
  //       ],
  //     }),
  //   ];
  // }

  handleEdit(row: Space) {
    console.log(row);
  }

  handleDelete(row: Space) {
    console.log(row);
  }
}
