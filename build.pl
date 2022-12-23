#!/bin/perl

use strict;
use warnings;
use JSON;
use Digest::SHA; 
use File::Spec::Functions;
use IO::File;
use File::Copy; # check if needed
use File::Basename; # check if needed
use File::Path qw/make_path/;
use List::Util 1.33 'any';
use IO::Compress::Zip qw(:all);

use Cwd;
use Cwd 'abs_path';

my ($SOURCE_DIR, $DEST_DIR, $ACTION, %args);


  my $USAGE = '
  Usage:
  build.pl [-n] source_path [-vfh] [-p] action
  
  source_path : path with exported add-on
  -v          : verbose
  -n          : no source path
  -f          : force refreshing
  -p          : custom destination path (cwd is assumed otherwise), 
                needs project.json.
  action      : action
  
  Available actions:
  make        : builds a zip file into "dist" directory
';

#
# compare 2 files
#

sub get_file_checksum {
  my ($file) = @_;
  open (my $handle, "<", $file) or die "Cannot open $file.";
    binmode ($handle);
    my $result = Digest::SHA->new("SHA-1")->addfile($handle)->hexdigest;
  close ($handle);
  return $result;
}

#
# Read a file content
#
sub readFile {
  my ($source) = @_;
  open( FILE, '<', $source ) or die "Could not open $source";
  my $result  = "";
    $result .= $_ while <FILE>;
  close (FILE);
  return $result;
}

#
# read command line
#
sub readCommandLine {
  $DEST_DIR = abs_path(getcwd());
  %args = ();

  die $USAGE if @ARGV == 0;
  
  #$SOURCE_DIR = $ARGV[0] if ! grep (/\^-n$/, @ARGV);
  
  #map any -key
  for (my $i = 0; $i < @ARGV; $i++) {
    
    #custom project path
    if ($ARGV[$i] eq "-p") {
      $DEST_DIR = $ARGV[++$i];
      next;
    }
    
    #set up flags
    if ($ARGV[$i] =~ /\-[vnf]+/) {
      for my $j (1..length($ARGV[$i])-1){        
        my $char = "-".substr($ARGV[$i], $j, 1);
        $args{$char} = 1;
      }
    }
    
    #either verb or source path
    if (defined $SOURCE_DIR) {
      $ACTION = lc $ARGV[$i];
    } else {
      $SOURCE_DIR = $ARGV[$i];
    }
  }
  
	return 0;
}

#
# map_converter
# converts a directory using a map file
#

sub map_converter {
  my %options = %{$_[0]};
  my $macroExtension = $_[1];
  #my (%options, $macroExtension) = @_;
  
  my $sourcePath = (exists $options{'sourceFolder'} )
        ? catdir($SOURCE_DIR, $options{'sourceFolder'})
        : catdir($SOURCE_DIR, $options{'folder'});
        
  my $destPath = catdir($DEST_DIR, $options{'folder'});
  my $sourceMap = catfile($SOURCE_DIR, $options{'map'});
  
  print "Convertion: source map: $sourceMap; destination folder: $destPath\n";  
  
  # add any character you want to preserve
  my $INVALID='[^A-Za-z0-9. _-]';
  
  my ($source, $dest, $sourceFile, $destFile, $sourceSha, $destSha) = "";
  
  my $updateProperties = (exists $options{'updatePropertiesFile'})
        ? $options{'updatePropertiesFile'}
        : 0;
  
  my (%propertiesFile, @props);
  
  my $wasPropFileUpdated = 0;
  
  my @result = ();
  
  #
  # Read properties file 
  #
  
  if ($updateProperties) {
      %propertiesFile = %{from_json(readFile(catfile($SOURCE_DIR, "mts_properties.json")))};
      @props = @{$propertiesFile{'properties'}};
  } else {
    @props = ();
  }
  
  open (my $MF, "<","$sourceMap") or die "FATAL: Could not open $sourceMap.\n";
  
  my @includes = (exists ($options{'include'}))
              ? @{$options{'include'}} 
              : ();
              
  my @excludes = (exists ($options{'exclude'}))
              ? @{$options{'exclude'}} 
              : ();
  
  if (exists $args{'-v'}) {
    print ("Will only consider " . join(",", @includes) . "\n") if @includes > 0;
    print ("Going to ignore " . join(",", @excludes) . "\n") if @excludes > 0;
    print "No inclusion/exclusion rules.\n " if (@includes+@excludes) == 0;
  }

  my ($res, $line, $rxSource, $rxDest, $fname, $propFound);
  
  while (<$MF>) {  
    $line = $_;
	  next if  ($line =~ /^ *$/);
	  
	  if ( $line =~ /([^ ]+) => (.*)/ ) {
		  $source = $1;
		  $dest = $2;
      $rxSource = quotemeta($source);
      $rxDest = quotemeta($dest);
      if (@includes > 0){
        $res = any {/$rxDest/} @includes;
        
        print "Ignoring $dest\n" unless $res || !exists $args{'-v'};
        next unless $res;
      }
      
      if (@excludes > 0){
        print "Ignoring $dest\n" if $res && exists $args{'-v'};
        next if any {/$rxDest/} @excludes;
      }
      
		  if ($dest =~ /$INVALID/g) {
        print "Warning: $dest - invalid characters.\n";
        $dest =~ s/$INVALID//g;
		  }
		  
		  $sourceFile = catfile($sourcePath, $source);
		  $destFile = catfile($destPath, $dest.$macroExtension);
		  
      my $destTime = 0;
      # Different content only
		  if (! exists $args{'-f'} && -e $destFile) {
          next if get_file_checksum($sourceFile) eq get_file_checksum($destFile);
          $destTime = (stat($destFile))[9];
		  }
		  
      my $sourceTime =  (stat($sourceFile))[9];
      
      if ( $destTime > $sourceTime) {
        print "WARNING: file $destFile was modified after source. Ignoring.\n";
        next;
      }
      
      print "Updating $destFile ($sourceFile).\n";
      copy($sourceFile, $destFile) or die "Error while copying $sourceFile: $!";
      
        # Do actual update
      
      if ($#props > 0){
        $propFound = 0;
        for my $i (0..$#props) {
           $fname = $props[$i]{'filename'}; 
           if ($fname =~ /$source/g){
             $props[$i]{'filename'} =~ s/$rxSource/$dest.mts/g;
             $wasPropFileUpdated = 1;
             $propFound = 1;
             last;
           }
        }
        print "ERROR: Cannot find $dest\n" if !$propFound;
		  }
	  } else {
		 print "ERROR: Mismatched line: $_\n";
	  }
  }
  
  close ($MF);
  if ($updateProperties && $wasPropFileUpdated) {
    print "Updating properties file...\n";
    $propertiesFile{'properties'} = \@props;
    
    open (FH, ">", catfile($DEST_DIR,"mts_properties.json")) or die $!;
      print FH JSON->new->ascii->pretty->encode(\%propertiesFile);
    close (FH);
  }
}

#
# updateFile
# writes a json hash to a file
#
sub updateFile {
  my $fileName = shift;
  my $dataq = shift;
  my %data = %{$dataq};
  
  print "Updating $fileName...";
  open (FH, ">", catfile($DEST_DIR,$fileName)) or die $!;
  print FH JSON->new->ascii->pretty->encode(\%data);
  close FH;
  print "OK\n";
}


#
# exposureGeneration
# generate auto exposure for all macros
#

sub exposureGeneration
{
  use Data::Dumper;
  
 my %config = %{$_[0]};
 
  my @includes = (exists ($config{'include'}))
              ? @{$config{'include'}} 
              : ();
              
  my @excludes = (exists ($config{'exclude'}))
              ? @{$config{'exclude'}} 
              : ();

  # add any event mts to exclude list
  if (exists $config{'events'}){
    my @events = @{$config{'events'}{'events'}};
    
    foreach (@events){
      my %obj = %{$_};
      push @excludes, $obj{'mts'} if defined $obj{'mts'};
    }
  }
  
  my $macroMts = '
  [h: "<!-- Auto-generated definitions -->"]
  [h: "<!-- please ensure the namespace is right -->"]
  [h: NAMESPACE = "' . $config{'namespace'} . '"]
';

  print "Reading macro list...";
  my @list = glob(catfile($config{'macro_dir'}, "*.mts"));
  die "Failed\n" if $#list == 0;
  print "OK (".@list." files).\n";
  
  print ( (@includes>0) ? @includes : "all");
  print " macros will be considered, " . @excludes . " will be ignored.\n";
  
  print "Exporting macros...\n";
  
  my $exportCount = 0;
  my $macroName = "";
  my $showOutput;
  my $checkOutput = 1 if exists $config{'showOutput'};
  
  my $macroRegex = "";
  foreach (@list) {
    
    $showOutput = $config{'defaultShowOutput'};
 
    if ($_ =~ /[\\\/]+([^\/]+)\.mts$/) {
      $showOutput = 0 if $checkOutput && any {/$macroName/} $config{'showOutput'};
      
      $macroName = $1;
      next if $macroName eq "export";
      next if (@excludes > 0 && grep (/^$macroName$/, @excludes));
      next if (@includes > 0 && !grep (/^$macroName$/, @includes));
         
      $macroMts = $macroMts . sprintf('[h: defineFunction("%s", strformat("%s@lib:%%{NAMESPACE}"), %d)]',
        $macroName, $macroName, $showOutput ) . "\n";
        
      $exportCount++;
    } else {
      print "Skipping $macroName\n";
      next;
    }
  }
  
  print "Exported $exportCount macros.\n";
  return if $exportCount == 0;
  
  my $exportFile = catfile($config{'macro_dir'}, "export.mts");
  
  print "Updating $exportFile...";
  open FH, ">", $exportFile or die "Cannot open $exportFile: $!\n";
  print FH $macroMts;
  close FH;
  
  print "Done\n";
}

#
# MAIN THREAD
#
print '
------------------------------------------------
MAPTOOL ADDON BUILDER v.1.0 (Maptool 1.12.2)
Written with no guarantee whatsoever by Witness1
------------------------------------------------

';

die $USAGE unless readCommandLine() == 0;
die $USAGE if exists $args{"-h"};


print "Source dir: $SOURCE_DIR\nDestination dir: $DEST_DIR\n";
print "Force mode: " . ((exists $args{'-f'}) ? "ON\n" : "OFF\n");
print "Verbose mode: " . ((exists $args{'-v'}) ? "ON\n" : "OFF\n");

my $SOURCEFILE=catfile($DEST_DIR, "project.json");

unless (-e $SOURCEFILE) {
	print "Missing project.json in $DEST_DIR.\n";
	exit 1;
}

print "Reading project configuration...\n";
my %PROJECT = %{from_json(readFile($SOURCEFILE))};

my %LIBRARY = %{$PROJECT{'library.json'}};

my %MACRO = %{$PROJECT{'macros'}};
my %PROPERTIES = ( exists $PROJECT{'properties'}) 
  ? %{$PROJECT{'properties'}}
  : ();
  
my $fullMacroPath = catdir($DEST_DIR, $MACRO{'folder'});

#
# source to addon
#

if (! exists ($args{'-n'}) ) {
  
  # MACROS
  print "Looking up for macro map...";
  die "FAILED! map is missing.\n" unless exists $PROJECT{'macros'};
  
  print "OK\n";

  print "\n[MACROS]\n";
  print "Checking for path $fullMacroPath...";
    make_path($fullMacroPath);
  print "OK\n";

  map_converter(\%MACRO, ".mts");

  # PROPERTIES
  print "\n[PROPERTIES]\n";
  if (exists $PROJECT{'properties'}) {
    delete $PROPERTIES{'updatePropertiesFile'} if exists $PROPERTIES{'updatePropertiesFile'};

    my $destDir = catdir($DEST_DIR, $PROPERTIES{'folder'});
    print "Checking for $destDir...";
      make_path($destDir);
    print "OK\n";

    my $sourceMap = catfile($SOURCE_DIR, $PROPERTIES{'map'});
    print "Checking for $sourceMap...";
      print "MISSING!\n" unless -e $sourceMap;
      die unless -e $sourceMap;
    print "OK\n";

    map_converter(\%PROPERTIES, ".txt");
  } else {
    print "No Lib:Token property specified. Ignoring.\n";
  }
  
  # AUTOINIT
  print "\n[AUTOINIT]\n";
  if (exists $PROJECT{'changeLoadToInit'} && $PROJECT{'changeLoadToInit'} == 1) {
    print "Looking for onCampaignLoad...";
    my $campLoadFile = catfile($DEST_DIR, $MACRO{'folder'}, "onCampaignLoad.mts");
    my $initFile = catfile($DEST_DIR, $MACRO{'folder'}, "onInit.mts");
    
    if (-e $campLoadFile) {
      print "OK. Renaming.\n";
      system "mv $campLoadFile $initFile";
    } else {
      print "ERROR: Requested event rename but missing onCampaignLoad.mts\n";
    }
  } else {
    print "No autoinit request. Ignoring\n";
  }

} else {
  print "Source import will be ignored.\n";
}

# AUTOEXPOSURE

my $shouldExposeMacros = (exists $PROJECT{'autoExpose'}) 
  ? $PROJECT{'autoExpose'}{'enabled'} 
  : 0;

if ($shouldExposeMacros) {
  print "\n[EXPOSURE]\n";
  my %EXPOSE = (%{$PROJECT{'autoExpose'}},
    (
      "namespace" => $LIBRARY{'namespace'},
      "macro_dir" => $fullMacroPath
    )
  );

  $EXPOSE{'events'} = $PROJECT{'events.json'} if exists $PROJECT{'events.json'};
  exposureGeneration(\%EXPOSE);
}

# FILES
print "\n[FILES]\n";

updateFile("library.json", \%LIBRARY);
updateFile("events.json", $PROJECT{'events.json'});


# ACTIONS
die "Done.\n" if !defined($ACTION);

if ($ACTION eq "make") {
  print "\n[MAKE]\n";
  my $zipTarget = catfile($DEST_DIR, $LIBRARY{'namespace'}.'-'.$LIBRARY{'version'}.".zip");
  
  print "Target: $zipTarget\n";
  
  my %ZIP = exists ($PROJECT{'zip'}) ? $PROJECT{'zip'} : ();
  
  # Change to zip dir
  chdir $DEST_DIR or die "Cannot access destination dir: $!\n";
  
  $DEST_DIR = ".";
  
  # Default include paths
  my @includes = ( "*.*", 
        catfile($DEST_DIR, "library", "*.*"),
        catfile($DEST_DIR, "library", "public", "*.*"),
        catfile($DEST_DIR, $MACRO{'folder'}, "*.*")
  );
  
  if (exists $ZIP{'include'}){
    push @includes, catfile($DEST_DIR, $_) foreach ($ZIP{'include'});
  }
  
  # Default exclude paths
  my @excludes = ( "build.pl", "project.json",
        catfile($DEST_DIR, "dist", "*.*")
        );
  
  if (exists $ZIP{'exclude'}){
    push @excludes, catfile($DEST_DIR, $_) foreach ($ZIP{'exclude'});
  }
  
  my @includeFileList = ();
  my @excludeFileList = ();
  
  print "Include paths: @includes\n Exclude paths: @excludes\n";
  
  # glob all paths
  push(@includeFileList, glob($_)) foreach (@includes);
  push(@excludeFileList, glob($_)) foreach (@excludes);
  
  my @filelist = ();
  my $escaped = "";
  foreach (@includeFileList) {
    $escaped = quotemeta($_);
    push (@filelist, $_) if ! grep(/$escaped/, @excludeFileList);
  }
  
  if ( exists $args{'-v'}) {
    print "Include file list:\n@includeFileList\n\n";
    print "Exclude file list:\n@excludeFileList\n\n";
    print "Final list:\n@filelist\n\n";
  } else {
    print "Include file list: " . @includeFileList . " files;\n";
    print "Exclude file list: " . @excludeFileList . " files;\n";
    print "Final list: " . @filelist . "\n";
  }
  
  die "FATAL: No file available!\n" if @filelist <= 0;
  
  my $zipFileName = catfile($DEST_DIR, "dist", sprintf("%s-%s.mtlib", $LIBRARY{'namespace'},
      $LIBRARY{'version'}) );
  
  print "Ensuring dist path...\n";
  make_path(catdir($DEST_DIR, "dist"));
  
  print "Zip File: $zipFileName\n";
  
  unlink $zipFileName if -e $zipFileName;
  
  zip [ (@filelist) ]  => $zipFileName or die "FAILED ZIP: $ZipError\n";
  
  print "Zip file ready.\n";
}
