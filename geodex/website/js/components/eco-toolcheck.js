/*jshint esversion: 6 */
import {
    html,
    render
} from './lit-html.js';
import './jsonld.min.js';

(function () {
    class FCTest extends HTMLElement {
        constructor() {
            super();

            const context = {
                "url": { "@id": "https://schema.org/url", "@type": "@id" },
                "image": { "@id": "https://schema.org/image", "@type": "@id" }
            };

            var obj;
            var inputs = document.getElementsByTagName('script');
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type.toLowerCase() == 'application/ld+json') {
                    obj = JSON.parse(inputs[i].innerHTML);
                }
            }

            (async () => {

                const detailsTemplate = [];

                // THIS IS NOT USED
                
                var url = new URL("https://graph.geodex.org/blazegraph/namespace/nabu/sparql"),

                    // var url = new URL("https://192.168.2.89:8080/blazegraph/sparql"),
                    // params = { query: "SELECT * { ?s ?p ?o  } LIMIT 11" }

                    params = {
                        query: `
 
                        PREFIX sdo:  <https://schema.org/>
 
                        ASK
                        WHERE
                        {
                          graph <urn:gleaner:milled:ocd:917529917c29eae1fcab0618f8f85f5587c771bb> {
                            
                           ?s  <https://schema.org/additionType> ?type .
                            }
                              BIND (str(?type) as ?label)
                           SERVICE <http://132.249.238.169:8080/fuseki/ecrr/query> {
                               GRAPH <http://earthcube.org/gleaner-summoned> 
                               {               
                                 ?rrs sdo:supportingData/sdo:encodingFormat  ?label .
                                 ?rrs sdo:name ?rrname.
                                }
                            }    
                         }
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
                // console.log(content);

                var r = content.results.bindings;

                //                r.forEach(element => {
                //                    detailsTemplate.push(html`<div> Test : ${element.disurl.value} </div>`);
                //                    detailsTemplate.push(html`<div> Test : ${element.name.value} </div>`);
                //                }
                //                );
                //


                console.log(r);

                r.forEach(element => {
                    detailsTemplate.push(html`<span>Hi</span>`);
                }
                );

                this.attachShadow({ mode: 'open' });
                render(detailsTemplate, this.shadowRoot);

            })();

        }
    }
    window.customElements.define('eco-toolcheck', FCTest);
})();


