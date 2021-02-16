/*jshint esversion: 6 */
import {
    html,
    LitElement
} from '../components/lit-element.js';
import './jsonld.js';

//curl https://dx.geodex.org/id/summoned/iris/107b0c662fa9051d3714b0e93fef981713d2ca48

    class ObjExchange extends LitElement {
        static get properties() {
            return {
                s_name: { type: String },
                s_description: { type: String },
                s_url: { type: String }
            };
        }
        createRenderRoot() {
            return this;
        }
        constructor() {
            super();
            this.s_name= ""
            this.s_description = ""
            this.s_url = ""
        }
         schemaItem (name, json_compacted){
            const s_name = (json_compacted["https://schema.org/"+name]? json_compacted["https://schema.org/"+name]:
                json_compacted["https://schema.org/"+name]?json_compacted["https://schema.org/"+name]: 'No '+name+' available')
            return s_name;
        }
        async firstUpdated(_changedProperties) {
            super.firstUpdated(_changedProperties);
            const queryString = window.location.search;
            console.log(queryString);

            const urlParams = new URLSearchParams(queryString);
            const object = urlParams.get('o');
            const fetchURL = `https://dx.geodex.org/id/summoned${object}`
            console.log(fetchURL);
            var url = new URL(fetchURL);
            const rawResponse = await fetch(url);
            //const content = await rawResponse.json();
            var contentAsText = await rawResponse.text();
            console.log(contentAsText);
            contentAsText = contentAsText.replace("http://schema.org/", "https://schema.org/")
            var content = JSON.parse(contentAsText)
            console.log(content);


            const context = {};


            const schemaItem = function (name, json_compacted){
                const s_name = (json_compacted["https://schema.org/"+name]? json_compacted["https://schema.org/"+name]:
                    json_compacted["https://schema.org/"+name]?json_compacted["https://schema.org/"+name]: 'No '+name+' available')
                return s_name;
            }
            // const compacted = jsonld.compact(obj, context).then(sC, fC);
            const compacted = jsonld.compact(content, context).then((providers) => {
                var j = JSON.stringify(providers, null, 2);
                var jp = JSON.parse(j);
                console.log(j.toString());

                const detailsTemplate = [];
                // detailsTemplate.push(html`<h3>Digital Document metadata</h3>`);
                this.s_name = schemaItem('name', jp);
                this.s_url = schemaItem('url', jp);
                this.s_description=schemaItem('description', jp);




                if (jp["https://schema.org/description"]||jp["http://schema.org/description"]) {
                    detailsTemplate.push(html`
                            <details>
                                <summary>JSON-LD Object</summary>
                                <pre>${j}</pre>
                            </details>`);
                } else detailsTemplate.push(html`
                        <div>No object available</div>`);

            })
        }
        render() {
let s_name = this.s_name;
let s_url  = this.s_url;
let s_description = this.s_description;





                    const template = html` <!--  <obj-exchange></obj-exchange> -->
                    <h1 class="row">
                     ${s_name}         </h1>
                    <div class="row">
                         <span class="btn btn-light">Website</span>
                        <span class="btn btn-light">Cite</span>
                        <span class="btn btn-light">Metadata</span>
                    </div>



                    <div class="row">

                            <span class="col-2 font-weight-bold">Type:</span>
                        <span class="col-8" >Data</span>
                    </div>
                    <div class="row">

                            <span class="col-2 font-weight-bold">Abstract:</span>
                            <span class="col-8">
                          ${s_description}</span></div>

                    <div class="row">

                            <span class="col-2 font-weight-bold">Creator:</span>
                            <span class="col-8">
Smith, Craig
DeMaster, David</span>
                    </div>
                    <div class="row">

                            <span class="col-2 font-weight-bold">Publisher:</span>
                            <span class="col-8">
Marine Geoscience Data System (MGDS)</span>
                    </div>
                    <div class="row">

                            <span class="col-2 font-weight-bold">Date:</span>
                            <span class="col-8">
                                2012-08-08</span>
                    </div>

                `;
                    //this.attachShadow({mode: 'open'});
                     return template              // var h =  `<div>${itemTemplates}</div>`;
                    // this.shadowRoot.appendChild(this.cloneNode(h));

              //  });

            //();
        }
    }

customElements.define('obj-exchange', ObjExchange);



