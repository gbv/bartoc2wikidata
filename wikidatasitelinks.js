/**
 * Get Wikidata URI, query corresponding Wikipedia links and inject into page.
 */
(function ($) {
    "use strict";

    // get Wikidata URI
    var item = 'http://www.wikidata.org/entity/Q48460'; // TODO: dynamic

    // query
    var api = "https://query.wikidata.org/bigdata/namespace/wdq/sparql";
    var sparql = "SELECT ?url { ?url <http://schema.org/about> <"+item+"> }";

    // inject result into HTML page
    function inject_sitelinks(urls) {
        // TODO
        console.log(urls);
    };

    $.ajax({
        url: api,
        data: { format: 'json', query: sparql },
        success: function(data) { 
            inject_sitelinks(
                $.map(data.results.bindings, function(row) {
                    return row.url.value;
                })
            );
        },
    });

    // TODO (MAYBE): nicer links
    // - get names of projects via
    //   https://www.wikidata.org/w/api.php?action=sitematrix
    // - get names of languages (how?)

})(jQuery);
