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
			headers: {
				'Accept': 'application/sparql-results+json',
				'Content-Type': 'application/json'
			} 
		});

		const content = await rawResponse.json();
		//console.log(content);

		const el = document.querySelector('#container2');
		render(showresults(content), el);
		// const s1 = document.querySelector('#side1');
		// render(projresults(content), s1);
	})();
}
