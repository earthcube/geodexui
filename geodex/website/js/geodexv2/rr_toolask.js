// Conduct the SPARQL call and call the lithtml functions to render results
import {
	html,
	render
} from '/js/lit-html.js';

export function rrtoolask(g) {
	console.log(g);

	(async () => {

		var url = new URL("https://graph.geodex.org/blazegraph/namespace/nabu/sparql"),

			// var url = new URL("http://192.168.2.89:8080/blazegraph/sparql"),
			// params = { query: "SELECT * { ?s ?p ?o  } LIMIT 11" }

			params = {
				query: `
				PREFIX sdo:  <http://schema.org/>  \
  \
ASK \
WHERE \
{ \
  graph <${g}> { \
     \
   ?s  <https://schema.org/additionType> ?type . \
    } \
      BIND (str(?type) as ?label) \
   SERVICE <http://132.249.238.169:8080/fuseki/ecrr/query> { \
       GRAPH <http://earthcube.org/gleaner-summoned>  \
       {                \
         ?rrs sdo:supportingData/sdo:encodingFormat  ?label . \
         ?rrs sdo:name ?rrname. \
        } \
    }     \
 } \
` }


console.log(params["query"]);


		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

		// console.log(params["query"]);

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

		const askresp = await rawResponse.json();
        //console.log(content);

        // TODO  try to return content here back to main
        console.log("-- end of RR tool ask --");
		console.log(askresp);

		document.getElementById(g).innerHTML = askresp.boolean;

		// could I grab an DOM ID and update it?

        return askresp;

	})();
}
