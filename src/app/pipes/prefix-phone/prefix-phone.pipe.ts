import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefixPhone'
})
export class PrefixPhonePipe implements PipeTransform {

  private prefixes: { [key: string]: string } = {
    'SV': '+503',
    'US': '+1',
    'MX': '+52',
    'ES': '+34',
    'CN': '+86',
    'PH': '+63',
    'MN': '+976',
    'DO': '+1-809',
  };

  transform(phone: string, iso2: string): string {
    if (!phone) {
      return '';
    }
    // Se convierte a mayúsculas para asegurar la coincidencia en el mapa.
    const code = iso2 ? iso2.toUpperCase() : '';
    const prefix = this.prefixes[code] || '';
    // Retorna el prefijo concatenado con el número telefónico.
    return prefix ? `${prefix} ${phone}` : phone;
  }

}
