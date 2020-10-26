/*jshint esversion: 6 */
import {
    html,
    render
} from './lit-html.js';
import './jsonld.min.js';

//curl https://dx.geodex.org/id/summoned/iris/107b0c662fa9051d3714b0e93fef981713d2ca48
(function () {
    class ObjExchange extends HTMLElement {
        constructor() {
            super();

            const queryString = window.location.search;
            console.log(queryString);

            const urlParams = new URLSearchParams(queryString);
            const object = urlParams.get('o');
            const fetchURL = `https://dx.geodex.org/id/summoned/${object}`
            console.log(fetchURL);

            (async () => {
                var url = new URL(fetchURL);
                const rawResponse = await fetch(url);
                const content = await rawResponse.json();
                console.log(content);

                const context = {
                    "url": { "@id": "https://schema.org/url", "@type": "@id" },
                    "image": { "@id": "https://schema.org/image", "@type": "@id" }
                };


                // const compacted = jsonld.compact(obj, context).then(sC, fC);
                const compacted = jsonld.compact(content, context).then((providers) => {
                    var j = JSON.stringify(providers, null, 2);
                    var jp = JSON.parse(j);
                    // console.log(jp);

                    const detailsTemplate = [];
                    // detailsTemplate.push(html`<h3>Digital Document metadata</h3>`);

                    if (jp["http://schema.org/name"] == undefined)
                        detailsTemplate.push(html`<div>No name available</div>`);
                    else detailsTemplate.push(html`<div> ${jp["http://schema.org/name"]} </div>`);

                    if (jp["http://schema.org/url"] == undefined)
                    detailsTemplate.push(html`<div>No url available</div>`);
                else detailsTemplate.push(html`<div> <a href="${jp["http://schema.org/url"]}">${jp["http://schema.org/url"]}</a> </div>`);

                    if (jp["http://schema.org/description"] == undefined)
                        detailsTemplate.push(html`<div>No description available</div>`);
                    else detailsTemplate.push(html`<div><p> ${jp["http://schema.org/description"]} </p></div>`);


                    this.attachShadow({ mode: 'open' });
                    render(detailsTemplate, this.shadowRoot);                // var h =  `<div>${itemTemplates}</div>`;
                    // this.shadowRoot.appendChild(this.cloneNode(h));

                });

            })();
        }
    }
    window.customElements.define('obj-exchange', ObjExchange);
})();


