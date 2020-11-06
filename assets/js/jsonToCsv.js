import moment from 'moment';

export default class JsonToCsv {

  constructor(headers, data, filename) {
    this.title = filename;
    this.headers = headers;
    this.data = data;
  }

  convertToCSV(objArray) {
    if (!objArray) objArray = this.itemsFormatted;
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line !== '') line += ','

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

  exportCSVFile() {
    if (this.headers) {
      this.data.unshift(this.headers);
    }

    // Convert Object to JSON
    const jsonObject = JSON.stringify(this.data);

    const csv = this.convertToCSV(jsonObject);

    const exportedFilename = `${this.title}_${moment().unix()}.csv` || 'export.csv';

    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

}
