#!/usr/bin/env perl
# Read bartoc.org JSON output and create mapping to Wikidata
# Requires Catmandu and wdq

use v5.14;
use Catmandu -all;

my $file = 'bartoc2wikidata.csv';
my $exporter = exporter('CSV', file => $file);

importer('JSON', array => 1, multiline => 1, file => 'download.json')->each(sub {
    my $r = shift;

    if ($r->{Title} !~ qr{^<a href="/en/node/(\d+)}) {
        warn "could not find bartoc ID:".$r->{Title}."\n";
        next;
    }
    my $bartoc = "http://bartoc.org/en/node/$1";
    my $wikipedia="";
    my $wikidata;

    if (($r->{Wikidata} // '') =~ qr{^<a href="([^"]+)}) {
        $wikidata = $1;        
        if ($wikidata !~ qr{^http://www\.wikidata\.org/entity/(Q\d+)$}) {
            warn "$bartoc: malformed Wikidata URI $wikidata\n";
            next;
        }
    } else {
        next unless ($r->{Wikipedia} // '') =~ qr{^<a href="([^"]+)};
        $wikipedia = $1;

        # skip links to article sections
        next if $wikipedia =~ /#/;

        my $json = `wdq -gen --ignore '$wikipedia'`;
        my $data = importer('JSON', multiline => 1, file => \$json)->first // { };
        $wikidata = $data->{id};
    }

    $exporter->add({
        bartoc    => $bartoc,
        wikipedia => $wikipedia,
        wikidata  => $wikidata,
    });
});

say $exporter->count . " mappings from BARTOC to Wikidata in $file";
