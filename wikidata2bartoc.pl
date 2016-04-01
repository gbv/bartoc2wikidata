#!/usr/bin/env perl
# Read a list of BARTOC IDS from Wikidata
# Requires Catmandu and wdq

use v5.14;
use Catmandu -all;

open(my $wdq, 'wdq -fcsv "?wikidata wdt:P2689 ?bartoc" |') or die $!;

my $file = 'wikidata2bartoc.csv';
my $exporter = exporter('CSV', file => $file);

importer('CSV', file => $wdq)->each(sub {
    my $r = shift;

    if ($r->{bartoc} =~ /^\d+$/) {
        $r->{bartoc} = "http://bartoc.org/en/node/" . $r->{bartoc};
    }
    $exporter->add($r);        
});

say $exporter->count . " mappings from Wikidata to BARTOC in $file";
