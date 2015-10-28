/**
 * Get Wikidata URI, query corresponding Wikipedia links and inject into page.
 */
(function ($) {
    "use strict";

    // get Wikidata URI
    
    var item = $('.field-name-field-wikidata').children('.field-items').children().children().attr('href');

    // query
    var api = "https://query.wikidata.org/bigdata/namespace/wdq/sparql";
    var sparql = "SELECT ?url { ?url <http://schema.org/about> <"+item+"> }";

    // inject result into HTML page
    function inject_sitelinks(urls) {
        // TODO
        if($.isArray(urls) && urls.length){
            console.log(urls);
            $('.field-name-field-wikidata').after('<div class="field field-name-field-wikipedia-urls field-type-taxonomy-term-reference field-label-inline clearfix"></div>');
            $('.field-name-field-wikipedia-urls').append('<div class="field-label">Wikipedia:&nbsp;</div');
            $('.field-name-field-wikipedia-urls').append('<div class="field-items"></div');
            var s = '';
            $.each(urls, function(i, url){
                var short = url.substr(8,2);
                if(i%2 === 0){
                    s = 'even';
                }else{
                    s = 'odd';
                }
                $('.field-name-field-wikipedia-urls > .field-items').append('<div class="field-item '+s+'" rel="dc:relation"><a href="'+url+'" class="ext" target="_blank">'+short+'</a></div>');
            });
        }
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
