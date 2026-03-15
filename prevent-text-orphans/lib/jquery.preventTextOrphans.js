(function ($) {
    "use strict";

    // https://github.com/daGUY/prevent-text-orphans
    $.fn.preventTextOrphans = function (options) {
        var settings = $.extend({
            minimum: 2,
            wrapperClass: "text-nowrap"
        }, options);

        return this.each(function () {
            var $element = $(this);

            if ($element.hasClass("disable-pto")) {
                return;
            }

            // Store settings for reapplication later
            $element.data("pto-settings", {
                minimum: settings.minimum,
                wrapperClass: settings.wrapperClass
            });

            $element.addClass("pto-initialized");

            applyTextOrphanPrevention($element, settings.minimum, settings.wrapperClass);
        });

        function applyTextOrphanPrevention($ptoElements, minimum, wrapperClass) {
            $ptoElements.each(function () {
                const $element = $(this);
                const $children = $element.children("p, div");

                if ($children.length > 0) {
                    $children.each(function () {
                        processElement($(this), minimum, wrapperClass);
                    });
                } else {
                    processElement($element, minimum, wrapperClass);
                }
            });
        }

        function processElement($element, minimum, wrapperClass) {
            const element = $element[0];

            // Get plain text word count (ignores HTML tags)
            const plainText = element.textContent.trim();
            const words = plainText.split(/\s+/).filter(w => w.length > 0);

            if (words.length <= minimum) {
                return;
            }

            // Store original HTML and dimensions
            const originalHtml = $element.html();
            const originalHeight = element.offsetHeight;

            // Find the text position where we need to start wrapping
            const wordsToWrap = minimum;
            const targetWordIndex = words.length - wordsToWrap;
            const wordsBeforeWrap = words.slice(0, targetWordIndex);
            const textBeforeWrap = wordsBeforeWrap.join(' ');

            // Find where to insert the wrapper in the HTML
            const htmlContent = element.innerHTML;
            let textIndex = 0;
            let htmlIndex = 0;
            let wrapStartPos = -1;

            // Walk through HTML to find position
            while (htmlIndex < htmlContent.length && textIndex < textBeforeWrap.length) {
                if (htmlContent[htmlIndex] === '<') {
                    // Skip HTML tag
                    while (htmlIndex < htmlContent.length && htmlContent[htmlIndex] !== '>') {
                        htmlIndex++;
                    }

                    htmlIndex++; // Skip '>'
                } else if (htmlContent[htmlIndex] === '&') {
                    // Handle HTML entities (e.g. &amp;)
                    const entityStart = htmlIndex;
                    while (htmlIndex < htmlContent.length && htmlContent[htmlIndex] !== ';') {
                        htmlIndex++;
                    }
                    htmlIndex++; // Skip ';'

                    // Treat entities as a single character in the text
                    textIndex++;
                } else {
                    // Compare text content
                    if (htmlContent[htmlIndex] === textBeforeWrap[textIndex]) {
                        textIndex++;
                        htmlIndex++;
                    } else if (/\s/.test(htmlContent[htmlIndex]) && /\s/.test(textBeforeWrap[textIndex])) {
                        // Handle multiple whitespace characters
                        while (htmlIndex < htmlContent.length && /\s/.test(htmlContent[htmlIndex])) {
                            htmlIndex++;
                        }
                        while (textIndex < textBeforeWrap.length && /\s/.test(textBeforeWrap[textIndex])) {
                            textIndex++;
                        }
                    } else {
                        htmlIndex++;
                    }
                }
            }

            // Skip any trailing whitespace in HTML
            while (htmlIndex < htmlContent.length && /\s/.test(htmlContent[htmlIndex])) {
                htmlIndex++;
            }

            wrapStartPos = htmlIndex;

            if (wrapStartPos === -1 || wrapStartPos >= htmlContent.length) {
                return;
            }

            // Insert the wrapper element
            const beforeWrap = htmlContent.substring(0, wrapStartPos);
            const afterWrap = htmlContent.substring(wrapStartPos);
            const wrappedHtml = `${beforeWrap}<span class="${wrapperClass}">${afterWrap}</span>`;

            $element.html(wrappedHtml);

            // Check if wrapping caused overflow
            const newHeight = element.offsetHeight;
            const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;
            const hasVerticalOverflow = newHeight > originalHeight;

            // If overflow detected, revert to original
            if (hasHorizontalOverflow || hasVerticalOverflow) {
                $element.html(originalHtml);
            }
        }
    };

    // On resize, remove and reapply wrapping
    $(window).on("resize orientationchange", function () {
        $('span.text-nowrap').each(function () {
            const $span = $(this);
            const html = $span.html();
            $span.replaceWith(html);
        });

        // Reapply the plugin with each element's stored settings
        $('.pto-initialized').each(function () {
            const $el = $(this);
            const settings = $el.data('pto-settings');

            if (settings) {
                $el.preventTextOrphans(settings);
            }
        });
    });
})(jQuery);