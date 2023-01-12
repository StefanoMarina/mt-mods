#!/bin/perl

use strict;
use warnings;
#use JSON;
use File::Spec::Functions;
#use IO::File;
#use File::Copy; # check if needed
use File::Basename; # check if needed
use File::Path qw/make_path/;
use List::Util 1.33 'any';
use IO::Uncompress::Unzip qw(unzip $UnzipError) ;

use Cwd;
use Cwd 'abs_path';

die 'Usage: build_documentation.pl path_to_lib_token' if @ARGV <= 0;

my $SOURCE_ZIP=$ARGV[0];
my $DESTINATION_FILE=catfile($ARGV[1], "mts_properties.json");

my $xmlFile = catfile(getcwd(), "content.xml");

# Unzip file here

unzip $SOURCE_ZIP  => $xmlFile, Name => "content.xml";

# Prepare chunk
my $CHUNK = `xsltproc mdIndex.xsl content.xml`;
my $HTML = `xsltproc htmlExporter.xsl content.xml`;

open (FH, ">", "MACROS.html") or die "Cannot open html.";
print  FH $HTML;
close FH;

my $MD =  `pandoc -f html -t markdown MACROS.html`;

# print Markdown
open FH, ">", "MACROS.md" or die "Cannot open md";
print FH $CHUNK;
print FH "\n";
print FH $MD;
close FH;

print "Created MACROS.md\n";

# clean up

unlink ("MACROS.html");
unlink ("content.xml");

