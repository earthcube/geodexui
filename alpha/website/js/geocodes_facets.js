
    import { rrtoolask } from './toolsregistry/rr_toolask.js';
    //import * as $ from 'jquery';
    async function getItemsFromSparql(q, n = 1000, o = 0) {
    console.log("Get Blaze full text");
    console.log(n);


    var url = new URL("https://graph.geodex.org/blazegraph/namespace/cdf/sparql"),

    // var url = new URL("http://192.168.2.89:8080/blazegraph/sparql"),
    // params = { query: "SELECT * { ?s ?p ?o  } LIMIT 11" }

// 			params = {
// 				query: ` prefix schema: <http://schema.org/> \
// SELECT ?total ?subj ?disurl ?score  ?name ?description \
//  WHERE {\
//   { \
//    ?lit bds:search \"${q}\" . \
//    ?lit bds:matchAllTerms "false" . \
//    ?lit bds:relevance ?score . \
//    ?subj ?p ?lit . \
//    BIND (?subj as ?s) \
//       {  \
//    		SELECT  ?s (MIN(?url) as ?disurl) { \
//              ?s a schema:Dataset . \
//              ?s schema:distribution ?dis . \
//    			?dis schema:url ?url . \
//    	  	} GROUP BY ?s \
//    } \
//    ?s schema:name ?name . \
//    ?s schema:description ?description .  \
//  } \
//  { SELECT  (COUNT(?s) AS ?total) \
//       WHERE { \
//          SERVICE <http://www.bigdata.com/rdf/search#search> { \
//               ?matchedValue \
//                         bds:search        \"${q}\" ; \
//                         bds:relevance     ?score ; \
//                         bds:rank          ?rank . \
//           } \
//           ?s        ?matchedProperty  ?matchedValue \
//           FILTER ( ! isBlank(?s) ) \
//         } \
// } \
//  }\
// ORDER BY DESC(?score)
// LIMIT ${n}
// OFFSET ${o}
// ` }
//const sparqlqueryData=
    params = {
    query: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                        prefix schema: <http://schema.org/>
                        SELECT distinct ?subj ?pubname (GROUP_CONCAT(DISTINCT ?placename; SEPARATOR=", ") AS ?placenames)
        (GROUP_CONCAT(DISTINCT ?kwu; SEPARATOR=", ") AS ?kw)
        ?datep  ?disurl ?score  ?name ?description ?resourceType
        WHERE {
                ?lit bds:search \"${q}\" .
            ?lit bds:matchAllTerms "false" .
            ?lit bds:relevance ?score .
            ?subj ?p ?lit .
            BIND (?subj as ?s)
        {
            SELECT  ?s (MIN(?url) as ?disurl) {
            ?s a schema:Dataset .
            ?s schema:distribution ?dis .
            ?dis schema:url ?url .
        } GROUP BY ?s
        }
            ?subj schema:name ?name .
            ?subj schema:description ?description .
            filter( ?score > 0.04).
            BIND('data' AS ?resourceType)
            OPTIONAL {?subj schema:datePublished ?datep .}
            OPTIONAL {?subj schema:publisher/schema:name ?pubname .}
            OPTIONAL {?subj schema:spatialCoverage/schema:name ?placename .}
            OPTIONAL {?subj schema:keywords ?kwu .}
        }
        GROUP BY ?subj ?datep ?pubname ?name ?description ?disurl ?score ?resourceType
        ORDER BY DESC(?score)
        LIMIT ${n}
        OFFSET ${o}`
}
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
    var items = _.map(content.results.bindings, function (item) {

    var flattened = _.mapObject(item, function (value, key) {
    if (key === 'kw') {
    var elements = value.value.split(',')
    return elements;
} else {
    // if (_.isEmpty(value.value)) {
    //     return null;
    // }
    return value.value;

}

})
    return flattened;
})
    return items; //content.results.bindings;
    // const el = document.querySelector('#resultsRecords');
    // const s1 = document.querySelector('#filters');
    // render(showresults(content), el);
    // // render(projresults(content), s1);


};
    $.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
    return null;
} else {
    return results[1] || 0;
}
}

    $(function () {
    let queryTextBox = $('#q');
    let q = queryTextBox.val();
    let qurl = $.urlParam('q');
    if (q === "") {
    if (qurl !== null) {
    q = qurl;
    queryTextBox.val(q);
}
}


    const item_template = `<div class="item card rounded mt-2">
                <div class="card-header">
                  <div class="card-title" ><%= obj.name %></div>
                  <div class="card-subtitle mb-2 text-muted"><%= obj.pubname %></div>
                </div>
                <div class="tags card-body overflow-auto">
                    <div class="card-text">
                     <% if (obj.description) {  %><%= obj.description %><% } %>
                    </div>
                    <div class="card-text">
                        <% if (obj.kw) {  %> <b>Keywords:</b> <%= obj.kw %><% } %>
                    </div>
                </div>
                <div class="card-footer">
                     <span class="badge badge-light"><%= obj.resourceType %></span>
                        <a class="card-link" href="<%= obj.disurl %>"><%= obj.disurl %></a>
                         <span class="badge badge-light" class="tool"></span>
                 </div>
            </div> `;


    const facetContainer = `<div class="accordion col-12  rounded" id="<%= id %>accordian">
               <div class="card" id="<%= id %>"></div></div> ` ;

    const facetTitleTemplate = `<div class="card-header" id="heading<%= id %>">
            <h2 class="ml-6 ">
                <button class="btn btn-link btn-block text-left " type="button" data-toggle="collapse"
                        data-target="#collapse<%= id %>" aria-expanded="true" aria-controls="collapse<%= id %>">
                    <%= title %><i class="fa fa-plus  float-right"></i>
                </button>

            </h2>
            </div>`;

    const facetListContainer = `<div id="collapse<%= id %>" class="collapse " aria-labelledby="heading<%= id %>" data-parent="#<%= id %>accordian">
            <div class="card-body">
                <div class="list-group pl-3 facetlist " >
            </div>

            </div>
       </div>`;
    const listItemTemplate = `<div class="list-group-item  facetitem">
                        <input type="radio" id="item<%= id %>" name="customRadioInline1"
                               aria-label="Checkbox for following text input" />
                        <label class="p-2" for="item<%= id %>"> <%= name %>  </label>
                        <span  class="badge badge-secondary float-right"><%= count %></span>
                    </div>`;

    const listItemTemplateSimple = `<div class="facetitem " id="<%= id %>"><%= name %> <span class="facetitemcount badge badge-light float-right">(<%= count %>)</span></div>`;
    const countTemplate = `<div class="facettotalcount col order-12"><%= count %> Results</div>`;
    const deselectTemplate = `<div class='btn btn-sm btn-info col order-6'>Clear all filters</div>`;

    const orderByTemplate = `<div class="dropdown col order-1"><button class=' btn btn-sm btn-info dropdown-toggle' id="orderbyMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="orderby-title">Sort by: </span> </button>
            <div class="dropdown-menu" aria-labelledby="orderbyMenuButton"><% _.each(options, function(value, key) { %>
                       <a class="orderbyitem dropdown-item" id="orderby_<%= key %>">
                       <%= value %> </a> <% }); %></div></button>
</div>`
    ;

    getItemsFromSparql(q)
    .then(function (results) {
    $.facetsettings = {
    items: results,
    facets: {
    // 'subj': 'Science Domain',
    'resourceType': 'Resource Type',
    'kw': 'Science Domain',
    // 'name': 'Place',
    'placenames': 'Place',
    'pubname': 'Publisher/Repo',
    'datep': 'Year Pulished'
},
    resultSelector: '#results',
    facetSelector: '#facets',
    facetContainer: facetContainer,
    facetTitleTemplate: facetTitleTemplate,
    facetListContainer: facetListContainer,
    listItemTemplate: listItemTemplateSimple,
    resultTemplate: item_template,

    deselectTemplate: deselectTemplate,
    orderByTemplate: orderByTemplate,
    countTemplate: countTemplate,
    paginationCount: 50,
    orderByOptions: {
    'name': 'Name',
    'pubname': 'Publisher',
    'date': 'Date',
    // 'subj': 'Subject',
    //'RANDOM': 'Score'
    'score': 'Score'
},
    facetSortOption: {'continent': ["North America", "South America"]}
};

    $.facetelize($.facetsettings);
    //$('#filterDiv').show();
    $('.facetsearch').on('show.bs.collapse', _handleCollapse);
    $('.facetsearch').on('hide.bs.collapse', _handleExpand);
//     $('.tool').on('render', rrtoolask );
//
//     $( ".tool" ).trigger({
//     type:"render"
// });

}
    )
});
