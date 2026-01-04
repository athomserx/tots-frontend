import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { MCTable } from '@mckit/table'
import { MCColumn, MCListResponse } from '@mckit/core';

@Component({
  selector: 'tots-spaces',
  imports: [MCTable, ButtonModule],
  templateUrl: './spaces.html',
  styleUrl: './spaces.scss',
})
export class Spaces {
  tableColumns: MCColumn[];

  tableResponse: MCListResponse<any> = {
    data: [
      { game_number: 1, status: 'Active' },
      { game_number: 2, status: 'Inactive' },
    ],
    total: 2,
  };

  constructor() {
    this.tableColumns = [
      { field: 'game_number', title: 'Game Number' },
      { field: 'status', title: 'Status' },
    ];
  }

}
