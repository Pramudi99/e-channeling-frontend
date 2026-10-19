import { Component, EventEmitter, Input, Output } from '@angular/core';


export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  imports: [],
  selector: 'app-data-table',
  standalone: true,
  styleUrl: './data-table.css',
  templateUrl: './data-table.html',
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() rows: object[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No records found.';

  @Output() viewRow = new EventEmitter<object>();
  @Output() editRow = new EventEmitter<object>();
  @Output() deleteRow = new EventEmitter<object>();

  getCellValue(row: object, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }
}




