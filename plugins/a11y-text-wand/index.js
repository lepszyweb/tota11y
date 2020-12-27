/**
 * Allows users to see what screen readers would see.
 */

let $ = require("jquery");
let Plugin = require("../base");

require("./style.less");

class A11yTextWand extends Plugin {
    getTitle() {
        return "Monitor czytnika ekranu";
    }

    getDescription() {
        return "Po najechaniu wskaźnikiem na element strony, wyświetla, jak czytnik ekranu ogłosi treść";
    }

    run() {
        // HACK(jordan): We provide a fake summary to force the info panel to
        //     render.
        this.summary(" ");
        this.panel.render();

        $(document).on("mousemove.wand", function(e) {
            let element = document.elementFromPoint(e.clientX, e.clientY);

            let textAlternative = axs.properties.findTextAlternatives(
                element, {});

            $(".tota11y-outlined").removeClass("tota11y-outlined");
            $(element).addClass("tota11y-outlined");

            if (!textAlternative) {
                $(".tota11y-info-section.active").html(
                    <i className="tota11y-nothingness">
                        No text visible to a screen reader
                    </i>
                );
            } else {
                $(".tota11y-info-section.active").text(textAlternative);
            }
        });
    }

    cleanup() {
        $(".tota11y-outlined").removeClass("tota11y-outlined");
        $(document).off("mousemove.wand");
    }
}

module.exports = A11yTextWand;
