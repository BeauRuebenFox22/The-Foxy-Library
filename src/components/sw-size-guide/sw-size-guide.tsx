import { Component, h, Host, State, Element } from '@stencil/core';

@Component({
  tag: 'sw-size-guide',
  styleUrl: 'sw-size-guide.scss',
  shadow: false,
})

export class SwSizeGuide {

  @Element() el: HTMLElement;
  @State() sizeUnits: 'mm' | 'inches' = 'mm';


  private countryDataSets: { [country: string]: string[] } = {
    "UK + Australia": [
      "F 1/2", "G", "G 1/2", "H", "H 1/2", "I", "I 1/2", "J", "J 1/2", "K", "K 1/2", "L", "L 1/2", "M", "M 1/2", "N", "N 1/2", "O", "O 1/2", "P", "P 1/2", "Q", "Q 1/2", "R", "R 1/2", "S", "S 1/2", "T", "T 1/2", "U", "U 1/2", "V", "V 1/2", "W", "W 1/2", "X", "x 1/2", "Y", "Z", "z 1/2", "-"
    ],
    "USA + Canada": [
      "3", "-", "3.5", "-", "4", "-", "4.5", "-", "5", "-", "5.5", "-", "6", "-", "6.5", "-", "7", "-", "7.5", "-", "8", "-", "8.5", "-", "9", "-", "9.5", "-", "10", "-", "10.5", "-", "11", "-", "11.5", "-", "12", "-", "12.5", "-", "13"
    ],
    "Europe": [
      "44", "45", "-", "46", "47", "-", "48", "-", "49", "50", "-", "51", "52", "-", "53", "-", "54", "55", "-", "56", "57", "-", "58", "59", "-", "60", "61", "-", "62", "-", "63", "64", "-", "65", "66", "-", "67", "-", "68", "69", "70"
    ],
    "China": [
      "6", "-", "7", "-", "8", "9", "-", "10", "-", "11", "12", "13", "-", "14", "-", "15", "-", "16", "17", "-", "18", "-", "19", "20", "-", "21", "-", "22", "-", "23", "-", "24", "25", "-", "26", "-", "-", "-", "-"
    ],
    "Singapore + Japan": [
      "4", "5", "-", "6", "7", "-", "8", "9", "-", "10", "11", "12", "-", "13", "-", "14", "-", "15", "16", "-", "17", "-", "18", "19", "-", "20", "-", "21", "22", "-", "23", "24", "-", "25", "-", "26", "-", "27"
    ],
    "Hong Kong": [
      "6", "-", "7.5", "-", "9", "-", "10", "-", "11", "12", "13", "-", "14", "-", "15", "-", "16", "-", "17", "-", "18", "19", "-", "20.5", "-", "22", "23", "-", "24", "25", "-", "26", "27.75", "-", "-", "-", "30"
    ],
    "Switzerland": [
      "4", "5.25", "-", "6.5", "-", "7.75", "-", "9", "-", "10", "-", "11.75", "12.75", "-", "14", "-", "15.25", "16.5", "-", "17.75", "-", "19", "20.5", "-", "22", "-", "23", "-", "25", "-", "27.75", "-", "-", "-", "30"
    ]
  };

  componentDidLoad() {
    this.el.addEventListener('change', this.handleCountrySelectChange);
  };

  private get table(): HTMLTableElement | null {
    return this.el.querySelector('table');
  }

  private updateCountryData(e) {
    const country = e.target.value;
    const countryData = this.countryDataSets[country];
    if(this.table) {
      const tds = this.table.querySelectorAll('tbody td');
      for(let i = 2, j = 0; i < tds.length; i += 3, j++) {
        if(countryData && countryData[j] !== undefined) {
          tds[i].textContent = countryData[j];
        };
      };
    };
  };

  private handleCountrySelectChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    if(target && target.id === 'country-select') this.updateCountryData(event);
  };

  private toggleSizeUnits = () => {
    this.sizeUnits = this.sizeUnits === 'mm' ? 'inches' : 'mm';
  };

  private convertToInches = (mm: string) => {
    const num = parseFloat(mm);
    return isNaN(num) ? mm : (num / 25.4).toFixed(2);
  };

  private convertTableUnits = () => {
    if(!this.table) return;
    const rows = this.table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if(cells.length >= 2) {
        if(this.sizeUnits === 'inches') {
          if(!cells[1].dataset.mm) cells[1].dataset.mm = cells[1].textContent || '';
          let [diameter, circumference] = (cells[1].dataset.mm || '').split('/').map(s => s.trim());
          if(circumference === undefined) {
            [diameter, circumference] = (cells[1].dataset.mm || '').split(' ').map(s => s.trim());
          }
          const dInch = this.convertToInches(diameter);
          const cInch = this.convertToInches(circumference);
          cells[1].textContent = `${dInch} / ${cInch}`;
        } else {
          if(cells[1].dataset.mm) {
            cells[1].textContent = cells[1].dataset.mm;
          };
        };
      };
    });
  };

  componentDidRender() {
    this.convertTableUnits();
  };

  render() {
    return (
      <Host>
        <button class="iv-sw-button" onClick={this.toggleSizeUnits}>
          Showing Sizes In {this.sizeUnits}
        </button>
        <slot></slot>
      </Host>
    );
  };

};