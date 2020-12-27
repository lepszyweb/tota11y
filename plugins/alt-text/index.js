/**
 * A plugin to check for valid alternative representations for images
 */

let $ = require("jquery");
let Plugin = require("../base");
let annotate = require("../shared/annotate")("alt-text");
let audit = require("../shared/audit");

class AltTextPlugin extends Plugin {
    getTitle() {
        return "Tekst alt obrazów";
    }

    getDescription() {
        return "Odnotowuje obrazy bez tekstu alternatywnego";
    }

    reportError(el) {
        let $el = $(el);
        let src = $el.attr("src") || "..";
        let title = "Obraz nie ma tekstu alt";
        let $error = (
            <div>
                <p>
                    Ten obraz nie ma przypisanego atrybutu "alt".
                    Przypisz teks atrybutu alt do tego obraz w taki sposób:
                </p>

                <pre><code>
                    {`&lt;img src="${src}" alt="Opis obrazu"&gt`}
                </code></pre>

                <p>
                    Jeśli obraz jest dekoracyjny i nie wnosi żadnych 
                    istotnych informacji do ilustrowanego tekstu, 
                    możesz pozostawić atrybut "alt" pusty
                    lub dodać mu atrybut "role" z wartością "presentation."
                </p>

                <pre><code>
                    {`&lt;img src="${src}" alt=""&gt;`}
                    <br />
                    {`&lt;img src="${src}" role="presentation"&gt;`}
                </code></pre>
            </div>
        );

        // Place an error label on the element and register it as an
        // error in the info panel
        let entry = this.error(title, $error, $el);
        annotate.errorLabel($el, "", title, entry);
    }

    run() {
        // Generate errors for any images that fail the Accessibility
        // Developer Tools audit
        let {result, elements} = audit("imagesWithoutAltText");

        if (result === "FAIL") {
            elements.forEach(this.reportError.bind(this));
        }

        // Additionally, label presentational images
        $("img[role=\"presentation\"], img[alt=\"\"]").each((i, el) => {
            // "Error" labels have a warning icon and expanded text on hover,
            // but we add a special `warning` class to color it differently.
            annotate
                .errorLabel($(el), "", "To jest obraz dekoracyjny")
                .addClass("tota11y-label-warning");
        });
    }

    cleanup() {
        annotate.removeAll();
    }
}

module.exports = AltTextPlugin;
