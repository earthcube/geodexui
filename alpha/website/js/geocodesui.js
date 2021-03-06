/* jshint esversion: 6 */
import {
	html,
	render
} from './lit-html.js';

// event listeners
document.querySelector('#q').addEventListener('keyup', function (e) {
	console.log("Document Query Selector");
	if (e.keyCode === 13) {
		searchActions();
	}
});

document.querySelector('#searchBtn').addEventListener('click', searchActions);

document.addEventListener('readystatechange', () => {
	console.log("Document Add event listener");
	if (document.readyState == 'complete') stateChangeSearch();
});

// popstate for nav buttons
window.onpopstate = event => {
	console.log("Window On pop state event");
	stateChangeSearch();
};
// $('.dropdown').on('show.bs.dropdown', function() {
// 	$('body').append($('.dropdown').css({
// 		position: 'absolute',
// 		left: $('.dropdown').offset().left,
// 		top: $('.dropdown').offset().top
// 	}).detach());
// });

function stateChangeSearch() {
	console.log("State Change Search Called");
	var qup = getAllUrlParams().q;
	if (qup == null) {
		qup = "";
	}

	// Hack to replace any string like "word+word2" with "word word2"
	// happens on the form feed
	var qupv2 = qup.replace(/(?<=[A-Za-z_0-9])[+](?=[A-Za-z_0-9])/g, ' ');

	console.log(qupv2);


	var q = decodeURIComponent(qupv2);

	// set the search then
	let qdo = document.querySelector('#q');
	qdo.value = q;

	var n = getAllUrlParams().n;
	if (n == null) {
		n = 20;
	}

	var o = getAllUrlParams().o;
	if (o == null) {
		o = 0;
	}
	console.log(o);

	if (q != null && q != "") {
		blazefulltext(q, n, o);
	}
	updateURL(q, n, o, false);

	const navel = document.querySelector('#resultsHeader');
	render(navstatus(q, n, o), navel);
}

// rename to clickSearch  (needs updated elsewhere to do that)
function searchActions() {
	console.log("Search Actions Called");

	// let params = (new URL(location)).searchParams;
	let q = document.querySelector('#q').value;
	let n = document.querySelector('#nn').value;

	var o = getAllUrlParams().o;
	if (o == null) {
		o = 0;
	}
	console.log(o);

	if (q != null && q != "") {
		blazefulltext(q, n, o);
	}
	updateURL(q, n, o, true);

	const navel = document.querySelector('#resultsHeader');
	render(navstatus(q, n, o), navel);
}

function updateURL(q, n, o, push) {
	console.log("UpdateURL Called");

	let params = new URLSearchParams(location.search.slice(1));
	params.set('q', q);
	params.set('n', n);
	params.set('o', o);

	// Issues with current browsers and titles
	document.title = `Search:${q}&n=${n}&o=${o}`;

	//window.history.replaceState({}, '', location.pathname + '?' + params);
	const state = {
		q: q,
		n: n,
		o: o
	}
	if (push) {
		window.history.pushState(state, 'Geocdes Search', location.pathname + '?' + params);
	}

}

// lithtml function to update the navigation arrows for result sets
function navstatus(q, n, o) {
	console.log("NavStatus Called");

	const itemTemplates = [];

	// itemTemplates.push(html`<p>Number: ${n} Offset: ${o}</p>`);
	var oi = parseInt(o, 10);
	var ni = parseInt(n, 10);

	var onext = oi + ni; // use unary plus operator to add strings by converting to numbers
	var oprev = onext - (2 * ni);

	console.log(oi);
	console.log(ni);
	console.log(onext);
	console.log(oprev);

	// step up and step down o
	itemTemplates.push(html`<li class="page-item"><a class="page-link" href="./search.html?q=${q}&n=${n}&o=0"><img style="height:35px" src="./images/icons/skip-start.svg">   </a></li>`);

	if (oprev >= ni) {
		itemTemplates.push(html`<li class="page-item"><a  class="page-link" href="./search.html?q=${q}&n=${n}&o=${oprev}"> <img style="height:35px" src="./images/icons/skip-backward.svg"> </a></li>`);
	}

	itemTemplates.push(html`<li class="page-item"><a class="page-link" href="./search.html?q=${q}&n=${n}&o=${onext}"> <img style="height:35px" src="./images/icons/skip-forward.svg"> </a></li>`);

	return html`
	<nav style="margin-top:5px">
	   <ul class="pagination">
	   ${itemTemplates}
	   </ul>
    </nav>
	`;
//<nav aria-label="Page navigation ">
//                     <ul class="pagination">
//                         <li class="page-item"><a class="page-link" href="#">Previous</a></li>
//                         <li class="page-item"><a class="page-link" href="#">1</a></li>
//                         <li class="page-item"><a class="page-link" href="#">2</a></li>
//                         <li class="page-item"><a class="page-link" href="#">3</a></li>
//                         <li class="page-item"><a class="page-link" href="#">Next</a></li>
//                     </ul>
//                 </nav>
}

// Conduct the SPARQL call and call the lithtml functions to render results
function blazefulltext(q, n, o) {
	console.log("Get Blaze full text");
	console.log(n);

	(async () => {

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
	params = {
		query: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
			prefix schema: <http://schema.org/>
			SELECT distinct ?subj ?pubname ?datep  ?disurl ?score  ?name ?description
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
		?s schema:name ?name .
		?s schema:description ?description .
		filter( ?score > 0.04).
		OPTIONAL {?s schema:datePublished ?datep .}
		OPTIONAL {?s schema:publisher ?pub .
		?pub schema:name ?pubname .}
	}
	ORDER BY DESC(?score)
	 LIMIT ${n}
     OFFSET ${o}
	`}
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

// Helper function: See if an object is undefine
function getSafe(fn) {
	try {
		return fn();
	} catch (e) {
		return undefined;
	}
}

// Helper function: truncate a block of text to a length n
function truncate(n, useWordBoundary) {
	if (this.length <= n) { return this; }
	var subString = this.substr(0, n - 1);
	return (useWordBoundary
		? subString.substr(0, subString.lastIndexOf(' '))
		: subString) + "...";
};

// Helper function return all the parameters from a URL
function getAllUrlParams(url) {
	console.log("Get All URL params Called");

	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

	// we'll store the parameters here
	var obj = {};

	// if query string exists
	if (queryString) {

		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];

		// split our query string into its component parts
		var arr = queryString.split('&');

		for (var i = 0; i < arr.length; i++) {
			// separate the keys and the values
			var a = arr[i].split('=');

			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

			// (optional) keep case consistent
			paramName = paramName.toLowerCase();
			if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {

				// create key if it doesn't exist
				var key = paramName.replace(/\[(\d+)?\]/, '');
				if (!obj[key]) obj[key] = [];

				// if it's an indexed array e.g. colors[2]
				if (paramName.match(/\[\d+\]$/)) {
					// get the index value and add the entry at the appropriate position
					var index = /\[(\d+)\]/.exec(paramName)[1];
					obj[key][index] = paramValue;
				} else {
					// otherwise add the value to the end of the array
					obj[key].push(paramValue);
				}
			} else {
				// we're dealing with a string
				if (!obj[paramName]) {
					// if it doesn't exist, create property
					obj[paramName] = paramValue;
				} else if (obj[paramName] && typeof obj[paramName] === 'string') {
					// if property does exist and it's a string, convert it to an array
					obj[paramName] = [obj[paramName]];
					obj[paramName].push(paramValue);
				} else {
					// otherwise add the property
					obj[paramName].push(paramValue);
				}
			}
		}
	}

	return obj;
}

// lithtml render function
const showresults = (content) => {
	console.log("-----------------------------------------------")
	console.log(content)

	var barval = content.results.bindings
	var count = Object.keys(barval).length;
	const itemTemplates = [];
	// itemTemplates.push(html`<div class="container">`);

	// Start the card

	for (var i = 0; i < count; i++) {
		const headTemplate = [];  // write to this and then save to the itemTemplate
		const containerTemplate = [];  // write to this and then save to the itemTemplate
		var title = "";
		var distUrl = "#";
		var fileType = null;
		var description = "";
		var seeProject = "";
		var searchType = "Dataset";
		var distUrl = {};
		var itemType="Data"; // default Data


		// console.log("-in  data files loop ---")
		// itemTemplates.push(html`<div class="row" style="margin-top:30px"> <div class="col-12"> <pre> <code>`);


		if (getSafe(() => barval[i].name.value)) {
			//	headTemplate.push(html`<a href="${barval[i].disurl.value}">${barval[i].name.value}</a> `);
			headTemplate.push(html`<a href="${barval[i].disurl.value}">${barval[i].name.value}</a> `);
			title = barval[i].name.value;
		}


		// loopTemplate.push(html`<div class="rescontainer">`);


		if (getSafe(() => barval[i].disurl.value)) {
			//containerTemplate.push(html`<span>URL: <a target="_blank" href="${barval[i].disurl.value}">${barval[i].disurl.value}</a> </span>`);
			distUrl = barval[i].disurl.value;
		}

		// if (getSafe(() => barval[i].score.value)) {
		// 	containerTemplate.push(html`<span> (score: ${barval[i].score.value}) </span> `);
		// }

		if (getSafe(() => barval[i].description.value)) {
			var s = barval[i].description.value
			containerTemplate.push(html`<p>${truncate.apply(s, [900, true])} </p>`);
			description = s; // for now
		}

		if (getSafe(() => barval[i].addtype.value)) {
			//containerTemplate.push(html`<p>File type: ${barval[i].addtype.value} </p>`);
			fileType = barval[i].addtype.value;
		}

		if (getSafe(() => barval[i].relto.value)) {
			containerTemplate.push(html`<p>See project:
			<a target="_blank" href="/id/do/${barval[i].relto.value}">${barval[i].relto.value}</a> </p>`);
			seeProject = barval[i].relto.value;
		}


		// itemTemplates.push(html`</code></pre></div></div>`);
// 		itemTemplates.push(html`
// <div class="card"><div class="card-body">${headTemplate}</div>
// <div class="rescontainer">${containerTemplate} </div> </div>
// `);

		// itemTemplates.push(html`    <div class="card-body">
		//   <div class="card-title">${headTemplate}
		//   </div>
		// <div class="card-text">${containerTemplate}
		// 	</div>
		// 	</div>`)
		// }
		itemTemplates.push(html`
<div class="card  my-1" id="card_${i}">
<div class="card-header">
        <a class="card-title " href="${distUrl}">${title}</a>
        </div>
		<div class="card-body">
            <div class="card-text">${description}</div>
        </div>
        <div class="card-footer " >
            <span class="badge badge-info badge-pill ">${itemType}</span>
            <div class="btn-group  " >
                <span class="btn btn-secondary dropdown " data-boundardy="window" aria-labelledby="dropdownMenuLink"> File</span>
                    <button type="button" class="btn btn-secondary dropdown-toggle" role="button" id="dropdownMenuLink"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="caret"></span>
                    </button>
                    <div  class="dropdown-menu" data-boundardy="window">
                        <a class="dropdown-item " href="${distUrl}"><img src="./images/icons/download.svg" alt="" title="Download"> Download</a>

                        <a class="dropdown-item " href="${distUrl}"><img src="./images/icons/download.svg" alt="" title="Download"> file Format x</a>
                     </div>

            </div>
        </div>
</div>
`);
	};
		return html`
			<div style="margin:30px">
			   ${itemTemplates}
			</div>
			`;


};

// lithtml render function
const projresults = (content) => {

	console.log("-top of Research Project---")

	var barval = content.results.bindings
	var count = Object.keys(barval).length;
	const itemTemplates = [];

	itemTemplates.push(html`<p>Related Projects</p>`);

	for (var i = 0; i < count; i++) {
		console.log("-in loop ---")


		if (getSafe(() => barval[i].type.value)) {
			if (barval[i].type.value == "http://schema.org/ResearchProject") {

				console.log("-Research Project---")

				itemTemplates.push(html`<div style="margin-top:30px">`);

				if (getSafe(() => barval[i].name.value) && getSafe(() => barval[i].url.value)) {
					itemTemplates.push(html`<p> <a href="${barval[i].url.value}">${barval[i].name.value}</a> </p>`);
				}

				if (getSafe(() => barval[i].relto.value)) {
					itemTemplates.push(html`<div> ${barval[i].relto.value} </div>`);
				}

				if (getSafe(() => barval[i].description.value)) {
					var s = barval[i].description.value
					itemTemplates.push(html`<div> Description: ${truncate.apply(s, [100, true])} </div>`);
				}


				if (getSafe(() => barval[i].addtype.value)) {
					itemTemplates.push(html`<div> ${barval[i].addtype.value} </div>`);
				}

				if (getSafe(() => barval[i].score.value)) {
					itemTemplates.push(html`<div> score: ${barval[i].score.value} </div>`);
				}

			}
		}

		itemTemplates.push(html`</div>`);
	}

	return html`
	<div style="class="row col-7 ">
	   ${itemTemplates}
    </div>
	`;
};



// CODE MORGUE

// function pageLoadSearch() {
// 	console.log("=======================  Window load =======================");
// }



// const OLDshowresults = (content) => {
// 	console.log("-----------------------------------------------")
// 	console.log(content);

// 	return html`<div style="text-align:center;margin-top:50px;position:relative">
// 	<br> Results:  ${content}</div>`;
// }

/*

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
	  method: 'POST', // *GET, POST, PUT, DELETE, etc.
	  mode: 'cors', // no-cors, *cors, same-origin
	  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	  credentials: 'same-origin', // include, *same-origin, omit
	  headers: {
		  'Content-Type': 'application/json'
		  // 'Content-Type': 'application/x-www-form-urlencoded',
	  },
	  redirect: 'follow', // manual, *follow, error
	  referrer: 'no-referrer', // no-referrer, *client
	  body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

try {
  const data = await postData('http://example.com/answer', { answer: 42 });
  console.log(JSON.stringify(data)); // JSON-string from `response.json()` call
} catch (error) {
  console.error(error);
}

*/
