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

die 'Usage: build_macro_properties.pl path_to_lib_token' if @ARGV <= 0;

my $SOURCE_ZIP=$ARGV[0];
my $DESTINATION_FILE=catfile(getcwd(), "mts_properties.json");

die "Cannot find $SOURCE_ZIP.\n" unless -e $SOURCE_ZIP;

my $xmlFile = catfile(getcwd(), "content.xml");

# Unzip file here

unzip $SOURCE_ZIP  => $xmlFile, Name => "content.xml";

die "Cannot unzip content.xml" unless -e "content.xml";

# Prepare chunk
my $JSON = `xsltproc jsonExporter.xsl content.xml`;

open (FH, ">", $DESTINATION_FILE) or die "Cannot open json file.";
print  FH $JSON;
close FH;

print "Created mts_properties.json\n";

# clean up

unlink ("content.xml");

