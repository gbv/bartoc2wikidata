#!/usr/bin/env perl
# Read bartoc.org JSON output and creating mapping to Wikidata
# Requires Catmandu and wdq

use v5.14;
use Catmandu -all;

my $exporter = exporter('CSV');

importer('JSON', array => 1, multiline => 1, file => 'download.json')->each(sub {
    my $r = shift;

    if ($r->{Title} !~ qr{^<a href="/en/node/(\d+)}) {
        warn "could not find bartoc ID:".$r->{Title}."\n";
        next;
    }
    my $bartoc = "http://bartoc.org/en/node/$1";

    next unless ($r->{Wikipedia} // '') =~ qr{^<a href="([^"]+)};
    my $wikipedia = $1;

    # skip links to article sections
    next if $wikipedia =~ /#/;

    my $json = `wdq -gen --ignore '$wikipedia'`;

    my $data = importer('JSON', multiline => 1, file => \$json)->first // { };

    $exporter->add({
        bartoc => $bartoc,
        wikipedia => $wikipedia,
        wikidata => $data->{id},
    });
});
