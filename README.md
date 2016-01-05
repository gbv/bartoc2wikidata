# Mapping BARTOC.org to Wikidata

The [Basel Register of Thesauri, Ontologies & Classifications](http://bartoc.org) contains records for more than 1.500 knowledge organization systems (KOS). Around 300 of them include a link to some Wikipedia article (in different languages). Further reuse of BARTOC data should be improved by using Wikidata URIs instead of Wikipedia URLs, as the latter can be infered from the former.

This document describes how the mapping is created to give an example for similar mapping efforts.

1. [Download BARTOC JSON dump](http://bartoc.org/de/node/770)
2. Parse JSON dump (with data processing toolkit [Catmandu](https://github.com/LibreCat/Catmandu#readme))
3. Look up Wikidata URIs (with Wikidata query client [wdq](https://github.com/nichtich/wdq#readme))
4. Insert Wikidata URIs to BARTOC database (manually)

A single Wikipedia URL can be mapped to Wikidata with `wdq` like this:

    $ wdq http://fr.wikipedia.org/wiki/RAMEAU
    [ {
      "description": "French authority file for subject headings",
      "id": "http://www.wikidata.org/entity/Q13421502",
      "label": "RAMEAU"
    } ]

The script `bartoc2wikidata.pl` converts JSON dump `download.json` by calling `wdq` for each Wikipedia URL.

The mapping resulted in a CSV file with 162 Wikidata URIs (`bartoc2wikidata.csv`). The number is lower than the full number of BARTOC records with Wikipedia URL because URLs link to an article section are not mapped. One additional Wikipedia article had no Wikidata item yet, so an new Wikidata item was created manually.

To illustrate the benefit of having Wikidata URIs instead of Wikipedia URLs, the reverse mapping can be implemented in JavaScript. This way new Wikipedia links are shown automatically as soon as an article about the selected knowledge organization system is created in some other language.

A sample BARTOC record with Wikidata ID is used as `example.html` for testing. The page includes JavaScript script `wikidatasitelinks.js` to get a Wikidata URI, query the corresponding Wikipedia links and inject the list as list into the HTML page.

## Postprocessing

The script `mappingproperties.pl` uses Wikidata URIs in `bartoc2wikidata.csv`
to look up whether corresponding Wikidata mapping properties exist. For
instance there is a mapping property for *Dewey Decimal Classification*
(<http://www.wikidata.org/entity/Q48460>):
<http://www.wikidata.org/entity/P1036> used to map around 4.000 Wikidata items
to DDC numbers. A preliminary result is stored in `mappingproperties.csv`.

## See also

This work is part of [project coli-conc](https://coli-conc.gbv.de/).

