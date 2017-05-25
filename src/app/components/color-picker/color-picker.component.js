"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ColorPickerComponent = (function () {
    function ColorPickerComponent() {
        this.assetCoords = {};
    }
    ColorPickerComponent.prototype.ngOnInit = function () {
        this.colorPicker.nativeElement.width = 300;
        this.colorPicker.nativeElement.height = 600;
        this.drawCpBackground();
        this.drawColorWheel();
        this.drawCircle();
    };
    ColorPickerComponent.prototype.drawCpBackground = function () {
        var bgWidth = 300;
        var bgHeight = 600;
        var xCenter = (window.innerWidth / 2) - (bgWidth / 2);
        var yCenter = (window.innerHeight / 2) - (bgHeight / 2);
        this.cpCtx = this.colorPicker.nativeElement.getContext('2d');
        this.cpCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.cpCtx.fillRect(0, 0, bgWidth, bgHeight);
    };
    ColorPickerComponent.prototype.drawColorWheel = function () {
        var cwWidth = 260;
        var cwHeight = 260;
        var cwX = 20;
        var cwY = 20;
        this.cpCtx = this.colorPicker.nativeElement.getContext('2d');
        this.cpCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.cpCtx.fillRect(cwX, cwY, cwWidth, cwHeight);
    };
    ColorPickerComponent.prototype.drawCircle = function () {
        this.cwCtx = this.colorWheel.nativeElement.getContext('2d');
        var radius = 130;
        var image = this.cwCtx.createImageData(2 * radius, 2 * radius);
        var data = image.data;
        for (var x = -radius; x < radius; x++) {
            for (var y = -radius; y < radius; y++) {
                var _a = this.xy2polar(x, y), r = _a[0], phi = _a[1];
                if (r > radius) {
                    // skip all (x,y) coordinates that are outside of the circle
                    continue;
                }
                var deg = this.rad2deg(phi);
                // Figure out the starting index of this pixel in the image data array.
                var rowLength = 2 * radius;
                var adjustedX = x + radius; // convert x from [-50, 50] to [0, 100] (the coordinates of the image data array)
                var adjustedY = y + radius; // convert y from [-50, 50] to [0, 100] (the coordinates of the image data array)
                var pixelWidth = 4; // each pixel requires 4 slots in the data array
                var index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;
                var hue = deg;
                var saturation = 1.0;
                var value = 1.0;
                var _b = this.hsv2rgb(hue, saturation, value), red = _b[0], green = _b[1], blue = _b[2];
                var alpha = 255;
                data[index] = red;
                data[index + 1] = green;
                data[index + 2] = blue;
                data[index + 3] = alpha;
            }
        }
        this.cwCtx.putImageData(image, 20, 20);
    };
    ColorPickerComponent.prototype.xy2polar = function (x, y) {
        var r = Math.sqrt(x * x + y * y);
        var phi = Math.atan2(y, x);
        return [r, phi];
    };
    // rad in [-π, π] range
    // return degree in [0, 360] range
    ColorPickerComponent.prototype.rad2deg = function (rad) {
        return ((rad + Math.PI) / (2 * Math.PI)) * 360;
    };
    // hue in range [0, 360]
    // saturation, value in range [0,1]
    // return [r,g,b] each in range [0,255]
    // See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
    ColorPickerComponent.prototype.hsv2rgb = function (hue, saturation, value) {
        var chroma = value * saturation;
        var hue1 = hue / 60;
        var x = chroma * (1 - Math.abs((hue1 % 2) - 1));
        var r1, g1, b1;
        if (hue1 >= 0 && hue1 <= 1) {
            (_a = [chroma, x, 0], r1 = _a[0], g1 = _a[1], b1 = _a[2]);
        }
        else if (hue1 >= 1 && hue1 <= 2) {
            (_b = [x, chroma, 0], r1 = _b[0], g1 = _b[1], b1 = _b[2]);
        }
        else if (hue1 >= 2 && hue1 <= 3) {
            (_c = [0, chroma, x], r1 = _c[0], g1 = _c[1], b1 = _c[2]);
        }
        else if (hue1 >= 3 && hue1 <= 4) {
            (_d = [0, x, chroma], r1 = _d[0], g1 = _d[1], b1 = _d[2]);
        }
        else if (hue1 >= 4 && hue1 <= 5) {
            (_e = [x, 0, chroma], r1 = _e[0], g1 = _e[1], b1 = _e[2]);
        }
        else if (hue1 >= 5 && hue1 <= 6) {
            (_f = [chroma, 0, x], r1 = _f[0], g1 = _f[1], b1 = _f[2]);
        }
        var m = value - chroma;
        var _g = [r1 + m, g1 + m, b1 + m], r = _g[0], g = _g[1], b = _g[2];
        // Change r,g,b values from [0,1] to [0,255]
        return [255 * r, 255 * g, 255 * b];
        var _a, _b, _c, _d, _e, _f;
    };
    ColorPickerComponent.prototype.findPos = function (obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    };
    ColorPickerComponent.prototype.rgbToHex = function (r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    };
    return ColorPickerComponent;
}());
__decorate([
    core_1.ViewChild('colorPicker'),
    __metadata("design:type", core_1.ElementRef)
], ColorPickerComponent.prototype, "colorPicker", void 0);
__decorate([
    core_1.ViewChild('colorWheel'),
    __metadata("design:type", core_1.ElementRef)
], ColorPickerComponent.prototype, "colorWheel", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ColorPickerComponent.prototype, "assetCoords", void 0);
ColorPickerComponent = __decorate([
    core_1.Component({
        selector: 'color-picker',
        templateUrl: './color-picker.template.html',
        styleUrls: ['./color-picker.styles.scss']
    }),
    __metadata("design:paramtypes", [])
], ColorPickerComponent);
exports.ColorPickerComponent = ColorPickerComponent;
//# sourceMappingURL=color-picker.component.js.map