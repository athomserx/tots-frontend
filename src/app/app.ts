import { Component, OnInit, Signal, signal } from '@angular/core';
import { MCTable } from '@mckit/table';
import { MCColumn, MCListResponse } from '@mckit/core';

@Component({
  selector: 'app-root',
  imports: [MCTable],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('tots-frontend');

  columns: MCColumn[] = [
    {
      title: 'Name',
      field: 'name',
      isShow: true,
      // isSortable: true,
      // isSortDefault: false,
      // isSortDescDefault: false
    }
  ]

  ngOnInit(): void {
    this.response.data = [{ name: 'Sergio' }, { name: 'Juan' }]
    this.response.total = 2
    this.response.current_page = 1
    this.response.per_page = 50
    this.response.from = 1
    this.response.to = 2
  }

  response = new MCListResponse<{ name: string }>()

  onPage(event: any) {
    console.log(event)
  }
}
