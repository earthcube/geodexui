/*jshint esversion: 6 */
import {
    html,
    LitElement
} from '../components/lit-element.js';
import './jsonld.js';
//import {unsafeHTML} from '../components/lit-html/directives/unsafe-html.js';
//import { unsafeHTML } from 'https://unpkg.com/lit-html/directives/unsafe-html?module';
//curl https://dx.geodex.org/id/summoned/iris/107b0c662fa9051d3714b0e93fef981713d2ca48

class ObjExchange extends LitElement {
    static get properties() {
        return {
            s_name: {type: String},
            s_description: {type: String},
            s_url: {type: String},
            s_contributor: {type: String},
            s_datePublished: {type: String},
            s_sdPublisher: {type: String},
            s_citation: {type: String},
            s_keywords: {type: Array},
            s_landingpage: {type: String},
            s_downloads: {type: Array},
            s_identifier_doi: {type: String}
            // place, temporal coverage
        };
    }

    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        this.s_name = ""
        this.s_description = ""
        this.s_url = ""
        this.s_contributor = ""
        this.s_datePublished = ""
        this.s_sdPublisher = ""
        this.s_citation = ""
        this.s_keywords = []
        this.s_landingpage = ""
        this.s_downloads = [{
            distType: "dist_type",
            contentUrl: "contentUrl",
            encodingFormat: "encodingFormat"
    }]
        this.s_identifier_doi = ""


    }

    schemaItem(name, json_compacted) {
        const s_name = (json_compacted["https://schema.org/" + name] ? json_compacted["https://schema.org/" + name] :
            json_compacted["https://schema.org/" + name] ? json_compacted["https://schema.org/" + name] : 'No ' + name + ' available')
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
        //console.log(contentAsText);
        contentAsText = contentAsText.replace("http://schema.org/", "https://schema.org/")
        var content = JSON.parse(contentAsText)
        //console.log(content);


        const context = {};


        const schemaItem = function (name, json_compacted) {
            const s_name = (json_compacted["https://schema.org/" + name] ? json_compacted["https://schema.org/" + name] :
                json_compacted["https://schema.org/" + name] ? json_compacted["https://schema.org/" + name] : 'No ' + name + ' available')
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
            this.s_description = schemaItem('description', jp);
            this.s_contributor = schemaItem('contributor', jp);
            this.s_datePublished = schemaItem('datePublished', jp);
            this.s_sdPublisher = schemaItem('sdPublisher', jp);
            this.s_citation = schemaItem('citation', jp);
            this.s_keywords = schemaItem('keywords', jp);
            this.s_landingpage = schemaItem('description', jp);
            var s_distribution = schemaItem('distribution', jp);
            var dist_type = s_distribution['@type'];
            var encodingFormat = schemaItem('encodingFormat', s_distribution);
            var contentUrl = schemaItem('contentUrl', s_distribution);
            this.s_downloads = [{
                distType: dist_type,
                contentUrl: contentUrl,
                encodingFormat: encodingFormat
            }]
            //this.s_identifier_doi= ""


            if (jp["https://schema.org/description"] || jp["http://schema.org/description"]) {
                detailsTemplate.push(html`
                    <details>
                        <summary>JSON-LD Object</summary>
                        <pre>${j}</pre>
                    </details>`);
            } else detailsTemplate.push(html`
                <div>No object available</div>`);


            const event = new CustomEvent('addMap', { bubbles: false,
                detail: { point: true, name: this.s_name,
                    location: null }
            });
            this.updateComplete.then(() => { document.dispatchEvent(event) });
        })

    }

    render() {
        let s_name = this.s_name;
        //let html_name = html`${unsafeHTML(this.s_name)}`
        let s_url = this.s_url;
        let s_description = this.s_description;
        let s_contributor = this.s_contributor;
        let s_publishedDate = this.s_datePublished;
        let s_publisher = this.s_sdPublisher;
        let s_citation = this.s_citation;
        let s_downloads = this.s_downloads;


        const template = html` <!--  <obj-exchange></obj-exchange> -->
        
            <div class="col-8">
                <div class="row">
                  <span class="font-weight-bold font-heavy">  ${s_name} </span> </div>
                <div class="row">
                    <a class="btn btn-light" href="${s_url}" target="_top">Website</a>
                    <span class="btn btn-light">Cite</span>
                    <span class="btn btn-light">Metadata</span>
                </div>


                <div class="row">

                    <span class="col-2 font-weight-bold">Type:</span>
                    <span class="col-8">Data</span>
                </div>
                <div class="row">

                    <span class="col-2 font-weight-bold">Abstract:</span>
                    <span class="col-8">
                          ${s_description}</span></div>

                <div class="row">

                    <span class="col-2 font-weight-bold">Creator:</span>
                    <span class="col-8">
${s_contributor}</span>
                </div>
                <div class="row">

                    <span class="col-2 font-weight-bold">Publisher:</span>
                    <span class="col-8">
${s_publisher}</span>
                </div>
                <div class="row">

                    <span class="col-2 font-weight-bold">Date:</span>
                    <span class="col-8">
                               ${s_publishedDate}</span>
                </div>
            </div>
            <div class="col-4 ">

                <div class="row">
                    <div id="mapid" style="width: 600px; height: 400px;">
                       
                     </div>
                </div>
                <div class="row font-weight-bold">Downloads</div>
                <div class="row">
                    ${this.s_downloads.map(i =>html`<a class="btn btn-primary w-75" href="${i.contentUrl}">${i.encodingFormat}</a>`)}
                   
                </div>
          

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



