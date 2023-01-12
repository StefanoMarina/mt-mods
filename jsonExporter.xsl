<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
<xsl:variable name="Q"><xsl:text>"</xsl:text></xsl:variable>
<xsl:variable name="A"><xsl:text>'</xsl:text></xsl:variable>
<xsl:variable name="NL"><xsl:text>
</xsl:text></xsl:variable>

<xsl:template match="/net.rptools.maptool.model.Token">
    <xsl:text>{
    "properties" : [
</xsl:text>
     <xsl:apply-templates select="macroPropertiesMap/entry/net.rptools.maptool.model.MacroButtonProperties">
        <xsl:sort select="label" data-type="text" order="ascending"/>
    </xsl:apply-templates>
    <xsl:text>
]}</xsl:text>
     </xsl:template>

  <xsl:template match="net.rptools.maptool.model.MacroButtonProperties">
    <xsl:text>{
</xsl:text>
    <xsl:value-of select="concat($Q,'filename',$Q, ': ',$Q,'public/', label, '.mts', $Q,',',$NL)"></xsl:value-of>
    <xsl:value-of select="concat($Q,'autoExecute',$Q, ': ', autoExecute, ',',$NL)"></xsl:value-of>
    
    <xsl:value-of select="concat($Q,'description',$Q)"></xsl:value-of>
      <xsl:variable name="cleansedA"><xsl:value-of select="translate(toolTip, concat($Q,'&#xA;'), $A)"/></xsl:variable>
      <xsl:variable name="cleansedB"><xsl:call-template name="tokenize"><xsl:with-param name="text" select="$cleansedA"/></xsl:call-template></xsl:variable>
      <xsl:variable name="cleansedC"><xsl:call-template name="tokenize">
          <xsl:with-param name="text" select="$cleansedB"/>
          <xsl:with-param name="delimiter" select="'&#9;'"/>
          <xsl:with-param name="entity" select="'\\t'"/>
        </xsl:call-template></xsl:variable>
    <xsl:text>: "</xsl:text><xsl:value-of select="$cleansedC"/><xsl:text>"</xsl:text>
    <xsl:text>}</xsl:text>
    <xsl:if test="not(position() = last())"><xsl:text>,
</xsl:text></xsl:if>
  </xsl:template>
  
  
  <!-- utility to translate multiple chars -->
  
<xsl:template name="tokenize">
    <xsl:param name="text"/>
    <xsl:param name="delimiter" select="'&#10;'"/>
    <xsl:param name="entity" select="'\\n'"/>
    <xsl:choose>
        <xsl:when test="contains($text, $delimiter)">
            <xsl:value-of select="substring-before($text, $delimiter)"/>
            <xsl:value-of select="$entity"/>
 
            <!-- recursive call -->
            <xsl:call-template name="tokenize">
                <xsl:with-param name="text" select="substring-after($text, $delimiter)"/>
                <xsl:with-param name="delimiter" select="$delimiter"/>
                <xsl:with-param name="entity" select="$entity"/>
            </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
            <xsl:value-of select="$text"/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:template>
</xsl:stylesheet>
