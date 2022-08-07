#!/bin/bash


#   DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
#         Version 2, December 2004 
#
#   Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 
#
#   Everyone is permitted to copy and distribute verbatim or modified 
#   copies of this license document, and changing it is allowed as long 
#   as the name is changed. 
#
#         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
#   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 
#
#   0. You just DO WHAT THE FUCK YOU WANT TO.


# This will output a function definitions for all macros for you to put where
# you want to.
# Usage example:
# ./manifest.sh > ./library/mtscript/public/manifest.mts
# manifest macros as functions.
# Be sure to adjust the output and which macro you actually want to manifest.

PUBDIR="./library/mtscript/public/"
LEN=${#PUBDIR}

MACROS=($(ls $PUBDIR*.mts))

NAMESPACE=$(grep namespace library.json | sed -r "s/(namespace|[\t' :\",])//g")

rm -rf $OUTFILE

echo "[h: '<!-- Auto-generated definitions -->']"
echo "[h: '<!-- please ensure the namespace is right -->']"

echo "[h: NAMESPACE = \"lib:$NAMESPACE\"]"

# Regex for file names. Weird characters may get the macro skipped.
for line in "${MACROS[@]}";
do
  NAME=${line:LEN:-4}
  echo "[h: defineFunction(\"$NAME\", strformat(\"$NAME@%{NAMESPACE}\"), 1)]"
done

