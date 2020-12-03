import {
	html,
	render
} from '/js/lit-html.js';
import { getSafe } from '/js/geodexv2/getSafe.js';
import { truncate } from '/js/geodexv2/truncate.js';


// lithtml render function
export const showresults = (content) => {
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

		// console.log("-in  data files loop ---")
		// itemTemplates.push(html`<div class="row" style="margin-top:30px"> <div class="col-12"> <pre> <code>`);


		if (getSafe(() => barval[i].name.value)) {
			headTemplate.push(html`<a href="${barval[i].disurl.value}">${barval[i].name.value}</a> `);
		}


		// loopTemplate.push(html`<div class="rescontainer">`);


		if (getSafe(() => barval[i].disurl.value)) {
			containerTemplate.push(html`<span>URL: <a target="_blank" href="${barval[i].disurl.value}">${barval[i].disurl.value}</a> </span>`);
		}

		if (getSafe(() => barval[i].score.value)) {
			containerTemplate.push(html`<span> (score: ${barval[i].score.value}) </span> `);
		}

		if (getSafe(() => barval[i].description.value)) {
			var s = barval[i].description.value
			containerTemplate.push(html`<p>${truncate.apply(s, [900, true])} </p>`);
		}

		if (getSafe(() => barval[i].addtype.value)) {
			containerTemplate.push(html`<p>File type: ${barval[i].addtype.value} </p>`);
		}

		if (getSafe(() => barval[i].relto.value)) {
			containerTemplate.push(html`<p>See project:
			<a target="_blank" href="/id/do/${barval[i].relto.value}">${barval[i].relto.value}</a> </p>`);
		}




		// itemTemplates.push(html`</code></pre></div></div>`);
		itemTemplates.push(html`<div class="rescard"><div class="resheader">${headTemplate}</div><div class="rescontainer">${containerTemplate} </div> </div>`);

	}


	return html`
	<div style="margin:30px">
	   ${itemTemplates}
    </div>
	`;
};

