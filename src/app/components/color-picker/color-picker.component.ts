import {
  Component,
  ElementRef,
  Inject,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.template.html',
  styleUrls: ['./color-picker.styles.scss']
})

export class ColorPickerComponent {
    private cpCtx: CanvasRenderingContext2D;
    private cwCtx: CanvasRenderingContext2D;

    @ViewChild('colorPicker') private colorPicker: ElementRef;
    @ViewChild('colorWheel') private colorWheel: ElementRef;

    @Input() private assetCoords = {};

    constructor() {
        
    }

    ngOnInit() {
        this.colorPicker.nativeElement.width = 300;
        this.colorPicker.nativeElement.height = 600;

        this.drawCpBackground();
        this.drawColorWheel();
        this.drawCircle();
    }

    drawCpBackground() {
        let bgWidth = 300;
        let bgHeight = 600;
        let xCenter = (window.innerWidth / 2) - (bgWidth / 2);
        let yCenter = (window.innerHeight / 2) - (bgHeight / 2);

        this.cpCtx = this.colorPicker.nativeElement.getContext('2d');

        this.cpCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.cpCtx.fillRect(0, 0, bgWidth, bgHeight);
    }

    drawColorWheel() {
        let cwWidth = 260;
        let cwHeight = 260;
        let cwX = 20;
        let cwY = 20;

        this.cpCtx = this.colorPicker.nativeElement.getContext('2d');

        this.cpCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.cpCtx.fillRect(cwX, cwY, cwWidth, cwHeight);
    }

  drawCircle() {
    this.cwCtx = this.colorWheel.nativeElement.getContext('2d');
    let radius = 130;
    let image = this.cwCtx.createImageData(2*radius, 2*radius);
    let data = image.data;

    for (let x = -radius; x < radius; x++) {
      for (let y = -radius; y < radius; y++) {
        
        let [r, phi] = this.xy2polar(x, y);
        
        if (r > radius) {
          // skip all (x,y) coordinates that are outside of the circle
          continue;
        }
        
        let deg = this.rad2deg(phi);
        
        // Figure out the starting index of this pixel in the image data array.
        let rowLength = 2*radius;
        let adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
        let pixelWidth = 4; // each pixel requires 4 slots in the data array
        let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;
        
        let hue = deg;
        let saturation = 1.0;
        let value = 1.0;
        
        let [red, green, blue] = this.hsv2rgb(hue, saturation, value);
        let alpha = 255;
        
        data[index] = red;
        data[index+1] = green;
        data[index+2] = blue;
        data[index+3] = alpha;
      }
    }

    this.cwCtx.putImageData(image, 20, 20);
  }
  
  xy2polar(x, y) {
    let r = Math.sqrt(x*x + y*y);
    let phi = Math.atan2(y, x);
    return [r, phi];
  }
  
  // rad in [-π, π] range
  // return degree in [0, 360] range
  rad2deg(rad) {
    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
  }
  
  // hue in range [0, 360]
  // saturation, value in range [0,1]
  // return [r,g,b] each in range [0,255]
  // See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
  hsv2rgb(hue, saturation, value) {
    let chroma = value * saturation;
    let hue1 = hue / 60;
    let x = chroma * (1- Math.abs((hue1 % 2) - 1));
    let r1, g1, b1;
    if (hue1 >= 0 && hue1 <= 1) {
      ([r1, g1, b1] = [chroma, x, 0]);
    } else if (hue1 >= 1 && hue1 <= 2) {
      ([r1, g1, b1] = [x, chroma, 0]);
    } else if (hue1 >= 2 && hue1 <= 3) {
      ([r1, g1, b1] = [0, chroma, x]);
    } else if (hue1 >= 3 && hue1 <= 4) {
      ([r1, g1, b1] = [0, x, chroma]);
    } else if (hue1 >= 4 && hue1 <= 5) {
      ([r1, g1, b1] = [x, 0, chroma]);
    } else if (hue1 >= 5 && hue1 <= 6) {
      ([r1, g1, b1] = [chroma, 0, x]);
    }
    
    let m = value - chroma;
    let [r,g,b] = [r1+m, g1+m, b1+m];
    
    // Change r,g,b values from [0,1] to [0,255]
    return [255*r,255*g,255*b];
  }

    findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
}
