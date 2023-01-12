<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>

  <xsl:template match="/net.rptools.maptool.model.Token">
    <xsl:apply-templates select="macroPropertiesMap/entry/net.rptools.maptool.model.MacroButtonProperties[group='0.api']">
      <xsl:sort select="label" data-type="text" order="ascending"/>
    </xsl:apply-templates>
  </xsl:template>
  
  <xsl:template match="/list">
        <xsl:apply-templates select="net.rptools.maptool.model.MacroButtonProperties">
            <xsl:sort select="label" data-type="text" order="ascending"/>
          </xsl:apply-templates>
  </xsl:template>
      
  <xsl:template match="net.rptools.maptool.model.MacroButtonProperties">
    <xsl:text>&lt;a id="</xsl:text><xsl:value-of select="label"/><xsl:text>"&gt;&lt;/a&gt;</xsl:text>
    <xsl:value-of select="toolTip"/>
  </xsl:template>
</xsl:stylesheet>
