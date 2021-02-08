/*jshint esversion: 6 */
import {
    html,
    render
} from '../components/lit-html.js';

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
                        query: `prefix sdos: <https://schema.org/>
                               PREFIX schemaold: <http://schema.org/>
                               select DISTINCT ?dataname ?appname   ?durl  ?turl ?frss
                               WHERE
                               {
                                   graph <urn:gleaner:milled${op}> {
                                   ?s schemaold:distribution|sdos:distribution ?dist ;
                                        schemaold:name|sdos:name ?dataname  .
                                   ?dist  schemaold:encodingFormat|sdos:encodingFormat ?type .
                                         OPTIONAL {?dist sdos:contentUrl ?durl }.
                                 }
                                 BIND (str(?type) as ?label)
                                SERVICE <http://132.249.238.169:8080/fuseki/ecrr/query> {
                                  GRAPH <http://earthcube.org/gleaner-summoned>

                                        {

                                          ?rrs a sdos:SoftwareApplication ;
                                               sdos:name ?appname ;
                                               sdos:supportingData ?df.
                               			?df sdos:encodingFormat ?label ;
                                               sdos:position "input".
                                          ?rrs sdos:potentialAction ?act.
                                          ?act sdos:target ?tar.
                                          ?tar a sdos:EntryPoint ;
                                           sdos:urlTemplate ?turl.
                                          filter contains(?turl,"{contentURL}")
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
                    console.log(element.turl.value);
                    console.log(element.durl.value);

                    // replace {contentURL}  element.turl.value  https://lipd.net/playground&source={contentURL}
                    // with element.durl.value http://lipdverse.org/Temp12k/1_0_2/Haugtjern.Eide.2009.lpd

                    var turl =  element.turl.value
                    var eu = turl.replace("{contentURL}", element.durl.value);

                    detailsTemplate.push(html`<div><p style="text-align:left">
                    <a target="_blank" href="${eu}">LiPD Playground</a></p> </div>`);
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
    window.customElements.define('eco-urltemplate', ECOSparql);
})();


