class Menu {
    static setup() {
        Menu.red = $("#red");
        Menu.green = $("#green");
        Menu.blue = $("#blue");
        Menu.hex = $("#hex_input");
        Menu.hue = $("#hue");
        Menu.saturation = $("#saturation");
        Menu.brightness = $("#brightness");
    }

    static show(selector) {
        this.selector = selector;

        Menu.red.val(selector.rgb[0]);
        Menu.green.val(selector.rgb[1]);
        Menu.blue.val(selector.rgb[2]);
        Menu.hex.val("#" + rgbToHex(selector.rgb));
        let hsb = RGBtoHSV(selector.rgb[0], selector.rgb[1], selector.rgb[2]);
        Menu.hue.val(Math.round(hsb[0]*360));
        Menu.saturation.val(Math.round(hsb[1]*100));
        Menu.brightness.val(Math.round(hsb[2]*100));

        Menu.red.change(() => {
            selector.rgb[0] = Menu.rgbInput(Menu.red);
            Menu.update();
        });
        Menu.green.change(() => {
            selector.rgb[1] = Menu.rgbInput(Menu.green);
            Menu.update();
        });
        Menu.blue.change(() => {
            selector.rgb[2] = Menu.rgbInput(Menu.blue);
            Menu.update();
        });

        Menu.hex.change(() => {
            selector.rgb = hexToRgb(Menu.hex.val()) || [0,0,0];
            Menu.update();
        });


        $(document).on('input', '#hue', () => {
            selector.rgb = HSVtoRGB(Menu.hue.val()/360, Menu.saturation.val()/100, Menu.brightness.val()/100);
            Menu.update(false);
        });
        $(document).on('input', '#saturation', () => {
            selector.rgb = HSVtoRGB(Menu.hue.val()/360, Menu.saturation.val()/100, Menu.brightness.val()/100);
            Menu.update(false);
        });
        $(document).on('input', '#brightness', () => {
            selector.rgb = HSVtoRGB(Menu.hue.val()/360, Menu.saturation.val()/100, Menu.brightness.val()/100);
            Menu.update(false);
        });
    }

    static update(slider=true) {
        let selector = this.selector;
        selector.update();
        draw();
        updateCode();
        Menu.red.val(selector.rgb[0]);
        Menu.green.val(selector.rgb[1]);
        Menu.blue.val(selector.rgb[2]);
        Menu.hex.val("#" + rgbToHex(selector.rgb));
        let hsb = RGBtoHSV(selector.rgb[0], selector.rgb[1], selector.rgb[2]);
        if (slider) {
            Menu.hue.val(Math.round(hsb[0]*360));
            Menu.saturation.val(Math.round(hsb[1]*100));
            Menu.brightness.val(Math.round(hsb[2]*100));
        }
    }

    static clear() {
        Menu.red.unbind();
        Menu.green.unbind();
        Menu.blue.unbind();
        Menu.hex.unbind();
        $(document).unbind();
    }

    static reset() {
        Menu.clear();
        Menu.red.val(0);
        Menu.green.val(0);
        Menu.blue.val(0);
        Menu.hex.val("#000000");
        Menu.hue.val(0);
        Menu.saturation.val(0);
        Menu.brightness.val(0);
    }

    static rgbInput(jInput) {
        let n = parseInt(jInput.val()) || 0;
        n = Math.min(Math.max(n, 0), 255);
        jInput.val(n);
        return n;
    }
}
