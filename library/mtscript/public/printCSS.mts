[h: cssList = getLibProperty("cssList")]
[h: return(cssList != "", "")]

[r, foreach (css, cssList, ""): strformat('
		<link type="text/css" rel="stylesheet" href="%{css}"></link>
')]