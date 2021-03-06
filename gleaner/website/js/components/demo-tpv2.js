/*jshint esversion: 6 */
import {
    html,
    render
} from './lit-html.js';

//curl https://dx.geodex.org/id/summoned/iris/107b0c662fa9051d3714b0e93fef981713d2ca48
(function () {
    class DemoTP extends HTMLElement {
        constructor() {
            super();

            // const object = "r3d100011761";
            const fetchURL = `https://throughputdb.com/api/ccdrs/annotations` // `https://throughputdb.com/api/db/annotations?id=${object}`
            // const fetchURL = `https://dx.geodex.org/data/tpdata.json`;

            var postdata = { "dbid": "r3d100012894 ", "additionalType": "site", "id": "tmeZsxjY5oSP1dOcgrJW" }
            console.log(fetchURL);
            (async (postdata) => {

                var url = new URL(fetchURL);
                const rawResponse = await fetch(url, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: JSON.stringify(postdata)
                    //body: JSON.stringify({ "dbid": "r3d100012894 ", "additionalType": "http://linked.earth/ontology#Dataset", "id": "tmeZsxjY5oSP1dOcgrJW" })
 // body data type must match "Content-Type" header
                });
                const content = await rawResponse.json();

                var j = JSON.stringify(content, null, 2);
                var jp = JSON.parse(j);
                console.log(jp);

                const detailsTemplate = [];

                const data = jp.data;
                detailsTemplate.push(html`<h4>${data.length} annotations. <br> <span style="font-size:small"> View all at Throughput </span> </h4>`);

                // caution!!  no null traps here.
                // need something like if (item[X] == undefined)
                var i = 0; // HACK to break out of loop
                for (const item of data) {
                    i = i + 1;
                    detailsTemplate.push(html`<div style="margin-top:5px;margin-bottom:10;text-align:left;margin: 0 auto;">`);
                    detailsTemplate.push(html`<p style="font-size:small;text-align:left">ORCID: ${item.orcid}:<br> <b>${item.annotation}</b></p>`);
                    detailsTemplate.push(html`</div>`);
                    if (i > 9) {
                        break;
                    }
                }

                this.attachShadow({ mode: 'open' });
                render(detailsTemplate, this.shadowRoot);                // var h =  `<div>${itemTemplates}</div>`;
                // this.shadowRoot.appendChild(this.cloneNode(h));


            })();
        }
    }
    window.customElements.define('demo-tp', DemoTP);
})();


