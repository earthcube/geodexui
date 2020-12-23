/* jshint esversion: 6 */
import {LitElement, html} from './lit-element.js';
import {render} from "../lit-html.js";
//import * as Jassa from '../jassa_es.js'

(function () {


    var sparql = null;
    var sparqlService = "https://graph.geodex.org/blazegraph/namespace/cdf/sparql";
    // $(document).ready(function () {
    //     // Add minus icon for collapse element which is open by default
    //     $(".collapse.show").each(function () {
    //         $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    //     });
    //
    //     // Toggle plus minus icon on show hide of collapse element
    //     $(".collapse").on('show.bs.collapse', function () {
    //         $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    //     }).on('hide.bs.collapse', function () {
    //         $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    //     });
    // });

    class SearchFilterComponent extends LitElement {
        static get properties() {
            return {
                title: {type: String, attribute: true},
                field: {type: String, attribute: true},
                id: {type: String, attribute: true},
                showSearch: {type: Boolean, attribute: true},
                settings: {type: Object, attribute: true},
                items: {type: Array, attribute: true},
                badge: {type: Boolean, attribute: true},
                // data: {attribute: false},
                // items: {type: Array},
            };
        }

        constructor() {
            super();
            this.addEventListener('show.bs.collapse', this._handleCollapse);
            this.addEventListener('hide.bs.collapse', this._handleExpand);
            var obj;
            var options = JSON.stringify(Object.assign({}, this.prop5, {'name': 'randy'}));
            // console.log(obj);
            const TemplateResult = [];

            let items = new Map();
            items.set("Example Domains", 0);

            this.items = items;

            //var jassa = new Jassa(Promise, $.ajax);
            // var jassa = Jassa.Jassa;
            // var rdf = Jassa.rdf;
            // var facete = Jassa.facete;
            // var sparql = Jassa.sparql;
            // var service = Jassa.service;
            // this.sparql = sparql;
            // this.sparqlService = new service.SparqlServiceHttp('http://dbpedia.org/sparql', ['http://dbpedia.org']);
            // sparqlService = new service.SparqlServiceCache(sparqlService);
            // sparqlService = new service.SparqlServicePaginate(sparqlService, 1000);
            // var facetTreeConfig = new facete.FacetTreeConfig();
            // var baseElement = sparql.ElementString.create('?s a <http://dbpedia.org/ontology/Castle>');
            // var baseVar = rdf.NodeFactory.createVar('s');

        }

        render() {
            var items = this.items;

            return html`
<div class="accordion col-12" id="accordion${this.id}">
    <div class="card">
        <div class="card-header" id="heading${this.id}">
            <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" 
                data-target="#collapse${this.id}" aria-expanded="true" aria-controls="collapse${this.id}">
                    ${this.title} <i class="fa fa-plus  float-right"></i>
                </button>
            </h2>
        </div>

        <div id="collapse${this.id}" class="collapse show" aria-labelledby="heading${this.id}" data-parent="#accordion${this.id}">
            <div class="card-body">
                   <div class="list-group pl-3">
                        <div class="list-group-item">
                            <div class="input-group">
    
                                <input type="text" class="form-control" aria-label="Text input with checkbox"
                                       placeholder="Search in XXXX">
                                </input>
                            </div>
                        </div>
                       ${Array.from(this.items.keys()).map(  i => html`<div class="list-group-item  ">

                        <input type="radio" id="itemOne_one" name="customRadioInline1"
                               aria-label="Checkbox for following text input"/>

                        <label class="p-2" for="itemOne_one">${i} </label> <span
                            class="badge badge-secondary float-right">${this.items[i]}</span>
                    </div>` 
                    ) }
                  


                </div>      
            </div>
        </div>
    </div>

</div>
`;


            // if (obj.distribution == undefined)
            // TemplateResult.push( html`<div> Distribution URL: No URL Available For the Distribution </div>`);
            // else TemplateResult.push( html`<div> Digital object:
            // <a target="_blank" href="${obj.distribution.contentUrl}">${obj.distribution.contentUrl}</a> </div>`);

            // this.attachShadow({mode: 'open'});
            // render(TemplateResult, this.shadowRoot);
        }
        _appendResults(results) {
            if (results ===null) {
                this.items = []
                array.forEach(results, function(result){
                        this.items.put(result)
                }
                )
                render();
            }

        }
        getAggregates(params){
            if (params === null){
                params.query.constraints(

                )
            }
        }
        /* SearchComponent API ============================================= */

        appendQClauses(params) {
            array.forEach(this.activeQClauses,function(qClause){
                if (typeof qClause.query === "object" && typeof qClause.query !== null) {
                    if (!params.queries) params.queries = [];
                    params.queries.push(qClause.query);
                    if (qClause.scorable) params.hasScorable = true;
                }
            });
        }

        appendQueryParams(params) {}

        applyUIOptions(searchOptions) {}


// Conduct the SPARQL call and call the lithtml functions to render results
         blazesparql(q) {
            // initial just a full text query
            console.log("facet");
            console.log(n);

            (async () => {

                var url = new URL("https://graph.geodex.org/blazegraph/namespace/cdf/sparql"),

                    // var url = new URL("http://192.168.2.89:8080/blazegraph/sparql"),
                    // params = { query: "SELECT * { ?s ?p ?o  } LIMIT 11" }

                    params = {
                        query: ` prefix schema: <https://schema.org/> 
SELECT  ?pubname (count(distinct ?s) as ?scount)
WHERE {   
  {
       ?lit bds:search \"${q}\" .
       ?s ?p ?lit .
       ?s schema:publisher ?pub .
       ?pub schema:name ?pubname .
       }
}
GROUP By ?pubname 
ORDER By DESC(?scount)
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

                const el = document.querySelector('#resultsRecords');
                const s1 = document.querySelector('#filters');
                render(showresults(content), el);
                // render(projresults(content), s1);

            })();
        }


        _handleCollapse(e) {
            console.log("collapse");

            // Toggle plus minus icon on show hide of collapse element

            $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");

        }

        _handleExpand(e) {
            console.log("collapse");

            // Toggle plus minus icon on show hide of collapse element
            $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
        }


        createRenderRoot() {
            return this;
        }

    }

    window.customElements.define('search-component-domains', SearchFilterComponent);
})();
