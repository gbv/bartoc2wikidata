#!/usr/bin/env perl
# Read bartoc to Wikidata mapping and find Wikidata mapping properties
# Requires Catmandu and wdq

use v5.14;
use Catmandu -all;

my $input = 'bartoc2wikidata.csv';

my $exporter = exporter('CSV', file => 'mappingproperties.csv');

importer('CSV', file => $input)->each(sub {
    my $r = shift;
    my $scheme = $r->{wikidata} or next;
    $scheme =~ s!.*/!!;

    my $wdq = `wdq -gen -lp --ignore '?p wdt:P1629 wd:$scheme'`;

    my $found = importer('JSON', multiline => 1, file => \$wdq)->next;
    if ($found) {
        my $property = $found->{p};
        $property =~ s!.*/!!;
        my $count = `wdq --ignore -ftext -cx '?x wdt:$property ?y'`;
        chomp $count;
        
        $exporter->add({
            wikidata => $r->{wikidata}, 
            property => $found->{p}, 
            label    => $found->{pLabel},
            count    => $count,
        });

        say STDERR $r->{wikidata} . " " . $count;

    } else {
        say STDERR $r->{wikidata} . " no mapping property found";
    }
});
