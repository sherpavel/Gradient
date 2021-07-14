class ColorSelector {
    constructor(rgb=[0,0,0]) {
        this.rgb = rgb;

        let dom = $("<div>")
            .addClass("selector")
            .css("background-color", `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
        dom.on("click", () => {
                Menu.clear();
                Menu.show(this);
                $(".selector").removeClass("active");
                dom.addClass("active");
            });
        
        let removeBtn = $('<img src="resources/close_icon.svg" alt="X"></img>')
            .addClass("close")
            .on("click", () => {
                dom.remove();
                COLORS.splice(COLORS.indexOf(this), 1);
                draw();
                if (dom.hasClass("active")) Menu.reset();
                updateCode();
            });

        dom.append(removeBtn);

        this.dom = dom; 
    }

    update() {
        this.dom.css("background-color", `rgb(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]})`)
    }
}
