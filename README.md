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

## Reverse Links from Wikidata (*update*)

After introduction of a new Wikidata property [BARTOC-ID (P2689)](http://www.wikidata.org/entity/P2689), reverse links from Wikidata to BARTOC could be added. The Catmandu fix file `b2w-quick.fix` was used to convert `bartoc2wikidata.csv` to the format for bulk editing Wikidata with [QuickStatements](http://tools.wmflabs.org/wikidata-todo/quick_statements.php).

Later updated should harvest BARTOC and Wikidata and compare the links. A list of Wikidata items with their BARTOC-IDs can be queried via SPARQL. SPARQL can also be used for additional qualitiy checks.

Links from BARTOC to Wikidata are included in `bartoc2wikidata.csv`. Links from Wikidata to BARTOC are created with `wikidata2bartoc.pl` and stored in `wikidata2bartoc.csv`. 


## Sample Wikidata queries with BARTOC-ID

Get a list of Wikidata-Items with their BARTOC-ID and optional mapping property
([run query](http://tinyurl.com/hyfm4t5)):

~~~sparql
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
SELECT ?kos ?name (IRI(CONCAT("http://bartoc.org/en/node/",?bartocID)) AS ?bartoc) ?property WHERE {
    ?kos wdt:P2689 ?bartocID .
    OPTIONAL { ?kos wdt:P1687 ?property }
    SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en,de,fr,da,fi" .
        ?kos rdfs:label ?name .
    }
}
~~~

Get only those items that are instances of Knowledge Organization System ([Q6423319](http://www.wikidata.org/entity/Q6423319)) or [its subclasses](https://angryloki.github.io/wikidata-graph-builder/?property=P279&item=Q6423319&mode=reverse) ([run query](http://tinyurl.com/hlwftml)):

~~~sparql
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
SELECT * WHERE {
    ?kos wdt:P31/wdt:P279* wd:Q6423319 .
    ?kos wdt:P2689 ?bartocID .
    SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en,de,fr,da,fi" .
        ?kos rdfs:label ?name .
    }
}
~~~

The difference between the first and the second result consists of Wikidata-Items that are not tagged as knowledge organization systems yet or wrongly connected to BARTOC.

## See also

This work is part of [project coli-conc](https://coli-conc.gbv.de/).

