/*jshint esversion: 6 */
import {
    html,
    render
} from './lit-html.js';
import './jsonld.min.js';

//curl https://dx.geodex.org/id/summoned/iris/107b0c662fa9051d3714b0e93fef981713d2ca48
(function () {
    class DemoTP extends HTMLElement {
        constructor() {
            super();

            // const object = "r3d100011761";
            // const fetchURL = `http://throughputdb.com/api/db/annotations?id=${object}`

            const fetchURL = `https://dx.geodex.org/data/tpdata.json`;
            console.log(fetchURL);

            (async () => {
                var url = new URL(fetchURL);
                const rawResponse = await fetch(url);
                const content = await rawResponse.json();

                var j = JSON.stringify(content, null, 2);
                var jp = JSON.parse(j);
                console.log(jp);

                const detailsTemplate = [];

                // caution..  no null traps here.   
                // need something like if (jp[X] == undefined)
                for (const item of jp.data) {
                    detailsTemplate.push(html`<div style="margin-top:5px;text-align:left;margin: 0 auto;">`);
                    detailsTemplate.push(html`<p style="text-align:left"><b>${item.author}:</b>${item.annotation}</p>`);
                    detailsTemplate.push(html`</div>`);
                }

                this.attachShadow({ mode: 'open' });
                render(detailsTemplate, this.shadowRoot);                // var h =  `<div>${itemTemplates}</div>`;
                // this.shadowRoot.appendChild(this.cloneNode(h));


            })();
        }
    }
    window.customElements.define('demo-tp', DemoTP);
})();


