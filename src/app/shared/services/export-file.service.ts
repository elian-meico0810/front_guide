import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root"
})
export class ExportFileService {

  
  exportToCsv(datasource:any,file:string) {
    const columns = this.getColumns(datasource);
    const csvData = this.convertToCsv(datasource, columns);
    this.downloadFile(csvData, `${file}.csv`, 'text/csv');
  }

  getColumns(data: any[]): string[] {
    const columns:any = [];
    data.forEach(row => {
      Object.keys(row).forEach(col => {
        if (!columns.includes(col)) {
          columns.push(col);
        }
      });
    });
    return columns;
  }

  convertToCsv(data: any[], columns: string[]): string {
    let csv = '';
    csv += columns.join(',') + '\n';
    data.forEach(row => {
      const values:any = [];
      columns.forEach(col => {
        values.push(row[col] || '');
      });
      csv += values.join(',') + '\n';
    });
    return csv;
  }

  downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type: type });
  
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
  }
}
