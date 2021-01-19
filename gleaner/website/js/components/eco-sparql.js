/*jshint esversion: 6 */
import {
    html,
    render
} from './lit-html.js';

(function () {
    class ECOSparql extends HTMLElement {
        constructor() {
            super();

            // const context = {
            //     "url": { "@id": "https://schema.org/url", "@type": "@id" },
            //     "image": { "@id": "https://schema.org/image", "@type": "@id" }
            // };

            var obj;
            var inputs = document.getElementsByTagName('script');
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type.toLowerCase() == 'application/ld+json') {
                    obj = JSON.parse(inputs[i].innerHTML);
                }
            }


            (async () => {

                const detailsTemplate = [];

                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const object = urlParams.get('o');
                var op = object.replaceAll("/", ":");  // this is stupid that I an turning this back now...  
                op = op.replace(".jsonld", "");
                console.log(op);

                var url = new URL("https://graph.geodex.org/blazegraph/namespace/nabu/sparql"),

                    // var url = new URL("https://192.168.2.89:8080/blazegraph/sparql"),
                    // params = { query: "SELECT * { ?s ?p ?o  } LIMIT 11" }

                    // params = {
                    //     query: `prefix schema: <http://schema.org/> \
                    //     SELECT ?name ?desc ?repo \
                    //     WHERE {  \
                    //        <https://n2t.net/ark:/23942/g2600006> schema:name ?name . \
                    //      <https://n2t.net/ark:/23942/g2600006> schema:description ?desc . \
                    //       <https://n2t.net/ark:/23942/g2600006> schema:codeRepository ?repo . \
                    //     }\
                    //     ` }





                    params = {
                        query: `PREFIX schema:  <https://schema.org/>    
                        PREFIX schemaold:  <http://schema.org/>       
                        select DISTINCT ?rrs ?name ?curl
                        WHERE                    {                    
                            graph <urn:gleaner:milled${op}> 
                              {
                                {     
                                  ?s schemaold:distribution|schema:distribution ?dist .    
                                  ?dist  schemaold:encodingFormat|schema:encodingFormat ?type .  
                                  ?dist schemaold:contentUrl|schema:contentUrl ?curl 
                                } 
                                UNION {
                                  VALUES (?dataset) { ( schema:Dataset ) ( schemaold:Dataset ) }
                                  ?s a ?dataset .  
                                  ?s  schemaold:encodingFormat|schema:encodingFormat ?type . 
                                  }
                             }
                             BIND (str(?type) as ?label)                                                                                                        
                             SERVICE <http://132.249.238.169:8080/fuseki/ecrr/query> {     
                              GRAPH <http://earthcube.org/gleaner-summoned>             
                               {   
                                  ?rrs schemaold:supportingData ?df.
                                      ?df schemaold:encodingFormat  ?label ;
                                          schemaold:position "input".	
                                      ?rrs schemaold:name ?name.      
                               }                 
                           }               
                        }`
                    };

               

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

                var r = content.results.bindings;
                console.log(r);


                r.forEach(element => {
                    detailsTemplate.push(html`<div><p style="text-align:left">
                    <a target="_blank" href="${element.rrs.value}"> ${element.name.value}</a></p> </div>`);
                }
                );


                // r.forEach(element => {
                // detailsTemplate.push(html`<sl-card class="card-footer" style="margin:3px;max-width: 290px;"> \
                //         ${element.name.value}  \
                //         <div slot="footer"> \
                //         <sl-button type="primary" pill> \
                //         <a target="_blank" href="${element.disurl.value}">View</a> \
                //         </sl-button> </div> </sl-card>`);
                // }
                // );




                this.attachShadow({ mode: 'open' });
                render(detailsTemplate, this.shadowRoot);

            })();

        }
    }
    window.customElements.define('eco-sparql', ECOSparql);
})();


