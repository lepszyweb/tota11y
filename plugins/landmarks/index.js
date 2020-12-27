/**
 * A plugin to label all ARIA landmark roles
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("landmarks");

class LandmarksPlugin extends Plugin {
    getTitle() {
        return "Punkty orienacyjne";
    }

    getDescription() {
        return "Etykietuje wszystkie punkty orientacyjne ARIA";
    }

    run() {
        $("[role]:not(.tota11y-toolbar,.tota11y-plugin)").each(function() {
            annotate.label($(this), $(this).attr("role"));
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = LandmarksPlugin;
