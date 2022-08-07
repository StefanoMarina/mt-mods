[h: query = upper(arg(1))]
[h: macro.return = if ( json.type(arg(0) ) != query,
	if (query=="ARRAY", "[]", "{}"), arg(0) )]