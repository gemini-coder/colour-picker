import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'app';
  startAt = '0';
  numberOfItems: string = '5';
  saturation = '100';
  lightness = '50';
  transparency = '100';

  type: 'hex' | 'rgb' | 'rgba' | 'hsl' = 'hex';
  direction: 'asc' | 'desc' = 'asc'

  list: { colour: string; value: number }[] = [];

  constructor() {
    this.generateColours();
  }

  generateColours(): void {
    this.list = [];
    for (let index = Number(this.startAt); index < Number(this.numberOfItems); index++) {
      this.list.push({
        colour: this.generateColour(index)[this.type],
        value: index,
      });
    }
  }

  generateColour(value: number) {
    return generateColour(
      Number(this.startAt),
      Number(this.numberOfItems),
      value,
      Number(this.saturation),
      Number(this.lightness),
      this.direction,
      Number(this.transparency) / 100
    );
  }

  satRangeChange(evt: Event) {
    this.generateColours();
  }

  ligRangeChange(evt: Event) {
    this.generateColours();
  }

  changeSaturation(): void {}
}

function generateColour(
  minNumber: number,
  maxNumber: number,
  thisValue: number,
  saturationLevel: number,
  lightnessLevel: number,
  direction: 'asc' | 'desc' = 'asc',
  transparency: number = 1,
): { hex: string; rgb: string, rgba: string, hsl: string } {
  const difference = (a: number, b: number) => { return Math.abs(a - b); }
  const mn = minNumber < 0 ? thisValue + (minNumber * -1) :thisValue - minNumber
  let percentage = (mn / (difference(maxNumber, minNumber))) * 100;
  if(direction == 'desc') percentage = (percentage - 100) * -1
  let red,
    green = 0;
  const blue = 0;
  if (percentage < 50) {
    red = 255;
    green = Math.round(5.1 * percentage);
  } else {
    green = 255;
    red = Math.round(510 - 5.1 * percentage);
  }
  const rgbColour = red * 0x10000 + green * 0x100 + blue * 0x1;
  // Get hue, saturation and lightness
  const hsl = (r: number, g: number, b: number): number[] => {
    let min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      hue,
      saturation,
      lightness = max;
    lightness = Math.floor((max / 255) * 100);
    if (max != 0) {
      saturation = Math.floor((delta / max) * 100);
    } else {
      return [0, 0, 0];
    }
    if (r == max) {
      hue = (g - b) / delta;
    } else if (g == max) {
      hue = 2 + (b - r) / delta;
    } else {
      hue = 4 + (r - g) / delta;
    }
    hue = Math.floor(hue * 60);
    if (hue < 0) hue += 360;
    return [hue, saturation, lightness];
  };

  return {
    hex: '#' + ('000000' + rgbColour.toString(16)).slice(-6),
    rgb: `rgb(${red}, ${green}, ${blue})`,
    rgba: `rgb(${red}, ${green}, ${blue}, ${transparency})`,
    hsl: `hsl(${hsl(red, green, blue)[0]}, ${saturationLevel}%, ${lightnessLevel}%, ${transparency})`,
  };
}
