<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <!--MD INDEX -->

  <xsl:output method="text"/>

<xsl:variable name="HEADER">
  <xsl:text>
# Macro Reference

Version 1.1.0

I apologize for inconsistencies between each macro explaination. From version 1.1.0, this file is generated automatically.

When `[]` or `{}` is near a parameter, this means a json array or a json object is expected as a parameter.

When a parameter has a =_something_ , i.e. `token=currentToken()`, this means the parameter will resolve to that value if not specified.

## Macro List
</xsl:text>
</xsl:variable>

  <xsl:template match="/net.rptools.maptool.model.Token">
    <xsl:value-of select="$HEADER"/>
    <xsl:apply-templates select="macroPropertiesMap/entry/net.rptools.maptool.model.MacroButtonProperties[group='0.api']">
              <xsl:sort select="label" data-type="text" order="ascending"/>
    </xsl:apply-templates>
  <xsl:text>
## Macro Description
</xsl:text>
  </xsl:template>
  
  <xsl:template match="/list">
    <xsl:value-of select="$HEADER"/>
    <xsl:apply-templates select="net.rptools.maptool.model.MacroButtonProperties">
        <xsl:sort select="label" data-type="text" order="ascending"/>
    </xsl:apply-templates>
  <xsl:text>
## Macro Description
</xsl:text>      
  </xsl:template>
  
  <xsl:template match="net.rptools.maptool.model.MacroButtonProperties">
    <xsl:text>[</xsl:text><xsl:value-of select="label"/><xsl:text>](#</xsl:text><xsl:value-of select="label"/><xsl:text>)
    
</xsl:text>
  </xsl:template>
</xsl:stylesheet>
