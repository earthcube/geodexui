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

            const object = "r3d100011761";
            const fetchURL = `https://throughputdb.com/api/db/annotations?id=${object}`

            // const fetchURL = `https://dx.geodex.org/data/tpdata.json`;
        
            
            console.log(fetchURL);

            (async () => {
                var url = new URL(fetchURL);
                const rawResponse = await fetch(url);
                const content = await rawResponse.json();

                var j = JSON.stringify(content, null, 2);
                var jp = JSON.parse(j);
                console.log(jp);

                const detailsTemplate = [];

                const data = jp.data;
                detailsTemplate.push(html`<h4>There are ${data.length} ThroughPut annotations.  View all Throughput </h4>`);

                // caution!!  no null traps here.   
                // need something like if (item[X] == undefined)
                var i = 0; // HACK to break out of loop
                for (const item of data) {
                    i = i + 1;
                    detailsTemplate.push(html`<div style="margin-top:5px;text-align:left;margin: 0 auto;">`);
                    detailsTemplate.push(html`<p style="text-align:left"><b>${item.author}:</b>${item.annotation}</p>`);
                    detailsTemplate.push(html`</div>`);
                    if (i > 3) {
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


