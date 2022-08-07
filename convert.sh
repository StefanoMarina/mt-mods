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

PROP_FILE="./property/prop_file_map.txt"
MTS_FILE="./macro_script_map.txt/"
MTS_DIR="./library/mtscript/public/"


if [[ -f properties.sed ]] 
  then rm properties.sed
fi

function convert() {
  RX='([^ ]+) => (.*)'
  
  # add any character you want to preserve
  
  INVALID='[^A-Za-z0-9. _-]'
  
  while read line
  do
    if [[ $line =~ $RX ]];
    then
      FILE=${BASH_REMATCH[1]}
      DEST=${BASH_REMATCH[2]}
      
      if [[ $DEST =~ $INVALID ]];
      then
       DEST=$(echo $DEST|sed -r "s/$INVALID/_/g")
      fi
      
      if [ -f "$1/$FILE" ] && [ "$FILE" != "$DEST.$3" ];
      then
        echo "Renaming $FILE to $DEST.$3..."
        mv "$1/$FILE" "$1/$DEST.$3"
      fi

      # check out macro properties
      if [[ $4 == 1 ]] && grep $FILE mts_properties.json
        then
          echo "s/$FILE/$DEST.$3/" >> properties.sed
      fi
    fi
  done < $2
}

convert "./property" "./property/prop_file_map.txt" "txt" 0
convert "./library/mtscript/public" "./macro_script_map.txt" "mts" 1

if [ -f properties.sed ];
 then
   echo "Running sed..."
   sed -f properties.sed mts_properties.json >> dummy.json
   mv dummy.json mts_properties.json
fi

