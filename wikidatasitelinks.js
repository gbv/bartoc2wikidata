/**
 * Get Wikidata URI, query corresponding Wikipedia links and inject into page.
 */
(function ($) {
    "use strict";

    // get Wikidata URI
    // TODO use :contains('http://www.wikidata.org/entity/') instead?
    var item = $('.field-name-field-wikidata').children('.field-items').children().children().attr('href');

    // query
    var api = "https://query.wikidata.org/bigdata/namespace/wdq/sparql";
    var sparql = "SELECT ?url { ?url <http://schema.org/about> <"+item+"> }";

    // inject result into HTML page
    function inject_sitelinks(urls) {
        if($.isArray(urls) && urls.length){
            var fieldName = 'field-name-field-wikipedia-urls';
            $('.field-name-field-wikidata').after('<div class="field '+fieldName+' field-type-taxonomy-term-reference field-label-inline clearfix"></div>');
            $('.'+fieldName).append('<div class="field-label">Wikipedia:&nbsp;</div');
            $('.'+fieldName).append('<div class="field-items"></div');
            var parity = '';
            $.each(urls, function(i, url){
                var langShort = url.substr(8,2);
                if(i%2 === 0){
                    parity = 'even';
                }else{
                    parity = 'odd';
                }
                $('.'+fieldName+' > .field-items').append('<div class="field-item '+parity+'" rel="dc:relation"><a href="'+url+'" class="ext" target="_blank">'+langShort+'</a></div>');
                $('.'+fieldName+' > .field-items > .field-item > a').css({'color':'#3F5E70','border':'1px solid #3F5E70','background':'#FFF'});
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
