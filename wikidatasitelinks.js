/**
 * Get Wikidata URI, query corresponding Wikipedia links and inject into page.
 */
(function ($) {
    "use strict";

    // get Wikidata URI
    var item = $('.field-name-field-wikidata a').attr('href');

    // inject list of sitelinks into HTML page
    function inject_sitelinks(links) {
        if (!$.isArray(links) || !links.length) return;

        var fieldName = 'field-name-field-wikipedia-urls';
        $('.field-name-field-wikidata').after('<div class="field '+fieldName+' field-type-taxonomy-term-reference field-label-inline clearfix"></div>');
        $('.'+fieldName).append('<div class="field-label">Wikipedia:&nbsp;</div');
        $('.'+fieldName).append('<div class="field-items"></div');

        $.each(links, function(i, link){
            var url  = link.url;
            var lang = link.lang;
            var parity = i % 2 ? 'even' : 'odd';
            $('.'+fieldName+' > .field-items').append('<div class="field-item '+parity+'"><a href="'+url+'" class="ext" target="_blank">'+lang+'</a></div>');
            $('.'+fieldName+' > .field-items > .field-item > a').css({'color':'#3F5E70','border':'1px solid #3F5E70','background':'#FFF'});
        });
    };

    // perform query
    if (item) {
        item = item.replace(/^https/,'http');

        var api = "https://query.wikidata.org/bigdata/namespace/wdq/sparql";
        var sparql = "PREFIX schema: <http://schema.org/>\n"
                   + "SELECT * { ?url schema:about <" 
                   + item
                   + ">; schema:inLanguage ?lang }";

        $.ajax({
            url: api,
            data: { format: 'json', query: sparql },
            success: function(data) { 
                inject_sitelinks(
                    $.map(data.results.bindings, function(row) {
                        return { url: row.url.value, lang: row.lang.value }
                    })
                );
            },
        });
    }
})(jQuery);
