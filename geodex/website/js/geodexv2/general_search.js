// Conduct the SPARQL call and call the lithtml functions to render results
/* jshint esversion: 6 */
import {
	html,
	render
} from '/js/lit-html.js';
import { showresults } from '/js/geodexv2/general_render.js';

export function generalText(q, n, o) {
	console.log("Get Blaze full text");
	console.log(n);

	(async () => {

		var url = new URL("https://graph.geodex.org/blazegraph/namespace/cdf/sparql"),

			params = {
				query: ` prefix schema: <http://schema.org/> \
SELECT ?subj ?disurl ?score  ?name ?description \
 WHERE { \
   ?lit bds:search \"${q}\" . \
   ?lit bds:matchAllTerms "false" . \
   ?lit bds:relevance ?score . \
   ?subj ?p ?lit . \
   BIND (?subj as ?s) \
      {  \
   		SELECT  ?s (MIN(?url) as ?disurl) { \
             ?s a schema:Dataset . \
             ?s schema:distribution ?dis . \
   			?dis schema:url ?url . \
   	  	} GROUP BY ?s \
   } \
   ?s schema:name ?name . \
   ?s schema:description ?description .  \
 } \
ORDER BY DESC(?score)
LIMIT ${n}
OFFSET ${o}
` }

		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

		console.log(params["query"]);

		const rawResponse = await fetch(url, {
			method: 'GET',
			//mode: 'no-cors', // no-cors, *cors, same-origin
			// cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			//credentials: 'omit', // include, *same-origin, omit
			headers: {
				'Accept': 'application/sparql-results+json',
				'Content-Type': 'application/json'
			} // ,
			// body: JSON.stringify({ query: 'SELECT * { ?s ?p ?o  } LIMIT 1', format: 'json' })
		});

		const content = await rawResponse.json();
		//console.log(content);

		// TODO  try to return content here back to main
		// TODO render showresults from main then

		const el = document.querySelector('#container2');
		// const s1 = document.querySelector('#side1');
		render(showresults(content), el);
		// render(projresults(content), s1);
	})();
}
