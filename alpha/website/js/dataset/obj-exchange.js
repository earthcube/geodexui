/*jshint esversion: 6 */
import {
    html,
    render
} from '../components/lit-html.js';
import './jsonld.js';

//curl https://dx.geodex.org/id/summoned/iris/107b0c662fa9051d3714b0e93fef981713d2ca48
(function () {
    class ObjExchange extends HTMLElement {
        constructor() {
            super();

            const queryString = window.location.search;
            console.log(queryString);

            const urlParams = new URLSearchParams(queryString);
            const object = urlParams.get('o');
            const fetchURL = `https://dx.geodex.org/id/summoned${object}`
            console.log(fetchURL);

            (async () => {
                var url = new URL(fetchURL);
                const rawResponse = await fetch(url);
                const content = await rawResponse.json();
                console.log(content);

                // const context = {
                //     "image": { "@id": "http://schema.org/image", "@type": "@id" },
                //     "name": { "@id": "http://schema.org/name", "@type": "@id" },
                //     "url": { "@id": "http://schema.org/url", "@type": "@id" },
                //     "description": { "@id": "http://schema.org/description", "@type": "@id" }
                // };

                const context = {};

                // const frame = {
                //     "@context": "http://schema.org/",
                //     "@type": "Dataset",
                //     "@explicit": true,
                //     "http://schema.org/name": {},
                // };

                // const framed = await jsonld.frame(content, frame);
                // console.log(JSON.stringify(framed, null, 2));

                // const compacted = jsonld.frame(content, frame).then((providers) => {
                //     var j = JSON.stringify(providers, null, 2);
                //     var jp = JSON.parse(j);
                //     // console.log(jp);

                //     const detailsTemplate = [];
                //     // detailsTemplate.push(html`<h3>Digital Document metadata</h3>`);

                //     if (jp["http://schema.org/name"] == undefined)
                //         detailsTemplate.push(html`<div>No name available</div>`);
                //     else detailsTemplate.push(html`<div> ${jp["http://schema.org/name"]} </div>`);

                //     if (jp["http://schema.org/url"] == undefined)
                //         detailsTemplate.push(html`<div>No url available</div>`);
                //     else detailsTemplate.push(html`<div> <a href="${jp["http://schema.org/url"]}">${jp["http://schema.org/url"]}</a> </div>`);

                //     if (jp["http://schema.org/description"] == undefined)
                //         detailsTemplate.push(html`<div>No description available</div>`);
                //     else detailsTemplate.push(html`<div><p> ${jp["http://schema.org/description"]} </p></div>`);


                //     this.attachShadow({ mode: 'open' });
                //     render(detailsTemplate, this.shadowRoot);                // var h =  `<div>${itemTemplates}</div>`;
                //     // this.shadowRoot.appendChild(this.cloneNode(h));

                // });

                // const compacted = jsonld.compact(obj, context).then(sC, fC);
                const compacted = jsonld.compact(content, context).then((providers) => {
                    var j = JSON.stringify(providers, null, 2);
                    var jp = JSON.parse(j);
                    // console.log(jp);

                    const detailsTemplate = [];
                    // detailsTemplate.push(html`<h3>Digital Document metadata</h3>`);

                    if (jp["https://schema.org/name"] == undefined)
                        detailsTemplate.push(html`<div>No name available</div>`);
                    else detailsTemplate.push(html`<div> ${jp["https://schema.org/name"]} </div>`);

                    if (jp["https://schema.org/url"] == undefined)
                        detailsTemplate.push(html`<div>No url available</div>`);
                    else detailsTemplate.push(html`<div> <a href="${jp["https://schema.org/url"]}">${jp["https://schema.org/url"]}</a> </div>`);

                    if (jp["https://schema.org/description"] == undefined)
                        detailsTemplate.push(html`<div>No description available</div>`);
                    else detailsTemplate.push(html`<div><p> ${jp["https://schema.org/description"]} </p></div>`);


                    if (jp["https://schema.org/description"] == undefined)
                        detailsTemplate.push(html`<div>No object available</div>`);
                    else detailsTemplate.push(html` <details> <summary>JSON-LD Object</summary><pre>${j}</pre></details>`);


                    this.attachShadow({ mode: 'open' });
                    render(detailsTemplate, this.shadowRoot);                // var h =  `<div>${itemTemplates}</div>`;
                    // this.shadowRoot.appendChild(this.cloneNode(h));

                });

            })();
        }
    }
    window.customElements.define('obj-exchange', ObjExchange);
})();


