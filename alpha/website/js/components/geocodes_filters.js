/* jshint esversion: 6 */
import {
    html,
    render
} from '/js/lit-html.js';

(function () {
    class SearchFilterComponent extends HTMLElement {
        constructor() {
            super();


            var obj;

            // console.log(obj);
            const TemplateResult = [];

            let myMap = new Map();
            myMap.set("title", "title");
            myMap.set("field", "field");
            myMap.set("options", "options");


            for (let [key, value] of myMap) {
                console.log(key + ' : ' + value);
                if (obj[value] == undefined)
                    TemplateResult.push( html`<div> ${key}: Not Available  </div>`);
                else TemplateResult.push( html`
<div class="accordion col-12" id="accordion${id}">
    <div class="card">
        <div class="card-header" id="heading${id}">
            <h2 class="mb-0">
                <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" 
                data-target="#collapse${id}" aria-expanded="true" aria-controls="collapse${id}">
                    ${title}
                </button>
            </h2>
        </div>

        <div id="collapse${id}" class="collapse show" aria-labelledby="heading${id}" data-parent="#accordion${id}">
            <div class="card-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input type="checkbox" aria-label="Checkbox for following text input"/>
                        </div>
                    </div>
                    <input type="text" class="form-control" aria-label="Text input with checkbox">
                </div>            </div>
        </div>
    </div>

</div>
`);
            }



            // if (obj.distribution == undefined)
            // TemplateResult.push( html`<div> Distribution URL: No URL Available For the Distribution </div>`);
            // else TemplateResult.push( html`<div> Digital object:
            // <a target="_blank" href="${obj.distribution.contentUrl}">${obj.distribution.contentUrl}</a> </div>`);

            this.attachShadow({ mode: 'open' });
            render(TemplateResult, this.shadowRoot);

        }
    }
    window.customElements.define('search-component', SearchComponent);
})();
