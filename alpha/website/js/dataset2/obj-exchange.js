/*jshint esversion: 6 */
// import {
//     html,
//     LitElement
// } from '../components/lit-element/lit-element.js';
import './jsonld.js';
//import {unsafeHTML} from '../components/lit-html/directives/unsafe-
import { html, LitElement } from 'https://unpkg.com/lit-element?module';
import { unsafeHTML } from 'https://unpkg.com/lit-html/directives/unsafe-html?module';
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
            has_citation: {type:Boolean},
            s_keywords: {type: Array},
            s_landingpage: {type: String},
            s_downloads: {type: Array},
            s_identifier_doi: {type: String},
            raw_json:{type:String}
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
        this.publisher = ""
        this.s_citation = ""
        this.hide_citation_tab = true
        this.s_keywords = []
        this.s_landingpage = ""
        this.s_downloads = [{
            distType: "dist_type",
            contentUrl: "contentUrl",
            encodingFormat: "encodingFormat",
            name:""
        }]
        this.s_identifier_doi = ""
        this.raw_json=""


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


        const schemaItem = function (name, json_compacted, noSchemaMessage="") {
            let s_name = json_compacted["https://schema.org/" + name] ? json_compacted["https://schema.org/" + name] :
                 json_compacted["http://schema.org/" + name] ? json_compacted["http://schema.org/" + name] : noSchemaMessage
            return s_name;
        }
        const hasSchemaProperty = function (name, jsonObj) {
            if ( jsonObj.hasOwnProperty("https://schema.org/" +name) ||
                jsonObj.hasOwnProperty("http://schema.org/" +name) )
                return true;
        }
        const geoplacename = function(s_spatialCoverage){
            if (Array.isArray(s_spatialCoverage)){
                var s_place = s_spatialCoverage.find((obj) => hasSchemaProperty('name',obj) )
                    var placename = schemaItem('name',s_place)
            } else {
                var placename = hasSchemaProperty('name',s_spatialCoverage) ? schemaItem('name',s_spatialCoverage) : null
            }
            return placename;
        }
        const getFirstGeoShape = function(s_spatialCoverage, shapetype){

            let geo;
// box, poly
            if (Array.isArray(s_spatialCoverage)){
                //geo = s_spatialCoverage.find((obj) => hasSchemaProperty('geo',obj) );
                let spatialC = s_spatialCoverage.filter((obj) => hasSchemaProperty('geo',obj) )
                let spatialCofType = spatialC.find(function(obj){
                    let geoInternal = schemaItem('geo', obj)
                    return hasSchemaProperty(shapetype, geoInternal)
                })
                if (spatialCofType) geo = schemaItem('geo', spatialCofType)
            } else {
                geo = hasSchemaProperty('geo', s_spatialCoverage) ? schemaItem('geo', s_spatialCoverage) : null;
            }
            if (Array.isArray(geo)){
                // get first match
                geo = geo.find((obj) => obj['@type'].endsWith('GeoShape') && hasSchemaProperty(shapetype, obj) );;
            }
            if (geo){
                //console.log(geo['@type'])
                if (geo['@type'].endsWith('GeoShape') && hasSchemaProperty(shapetype, geo)){
                    var g = schemaItem (shapetype, geo);
                    var coords = g.replaceAll(',',' ' ).split(' ').filter( e => e.trim().length > 0)

                    var forLeaflet = []
                    for (var i = 0; i < coords.length ; i= i+2){

                        forLeaflet.push([ parseFloat(coords[i] ),  parseFloat(coords[i+1]) ])
                    }
                    return forLeaflet
                }
            }
            return null;
        }

        // "@type": "https://schema.org/GeoCoordinates",
        //     "https://schema.org/latitude": 43.10841,
        //     "https://schema.org/longitude": -118.25872000000001
        const getGeoCoordinates = function(s_spatialCoverage, shapetype){
            // box, poly
            var geo =[]
            var coords = null
            if (Array.isArray(s_spatialCoverage)){
                // geo = s_spatialCoverage.find((obj) => hasSchemaProperty('geo',obj) )
                let spatialC = s_spatialCoverage.filter((obj) => hasSchemaProperty('geo',obj) )
                let spatialCofType = spatialC.filter(function(obj){
                    let geoInternal = schemaItem('geo', obj)
                    return geoInternal['@type'].endsWith("GeoCoordinates")
                })
                if (spatialCofType) {spatialCofType = spatialCofType.map(function(obj){
                    let geoInternal = schemaItem('geo', obj)
                     if ( geoInternal['@type'].endsWith("GeoCoordinates") ){
                         return geoInternal
                     }
                })}
                if (spatialCofType) geo = spatialCofType
            } else {
                 if (hasSchemaProperty('geo',s_spatialCoverage) ) {
                   geo = schemaItem('geo', s_spatialCoverage)
                 }
            }
            // sometimes obj has no @type..
            if (Array.isArray(geo)) {
                geo = geo.filter((obj) => obj['@type'] === 'https://schema.org/GeoCoordinates' || obj['@type'] === 'http://schema.org/GeoCoordinates');

                var coords = geo.map(function (obj) {
                    var lat = schemaItem('latitude', obj)
                    var lon = schemaItem('longitude', obj)
                    if (lat && lon) {
                        return [parseFloat(lat), parseFloat(lon)]
                    }
                })
            }
            else {
                if (geo['@type']=== 'https://schema.org/GeoCoordinates' || geo['@type'] === 'http://schema.org/GeoCoordinates') {
                    var lat = schemaItem('latitude', geo)
                    var lon = schemaItem('longitude', geo)
                    if (lat && lon) {
                        coords = [[parseFloat(lat), parseFloat(lon)]]
                    }
                }

            }
            return coords;
        }

        function getDistributions(s_distribution, s_url) {
            var downloads = []
            //if (! s_distribution &&  ! s_url) return [];
            if (! s_distribution ) return [];
            if (Array.isArray(s_distribution)){

                s_distribution.map((obj) => downloads= downloads.concat (makeLinkObj(obj)))
            }
            else {

               downloads= downloads.concat (makeLinkObj(s_distribution))
            }
            // if (s_url) {
            //    var link =  {
            //         distType: "URL",
            //             contentUrl: s_url,
            //         encodingFormat: "Website",
            //         name: "Document URL"
            //     }
            //     downloads.push(link)
            // }
            return downloads
        }

        function makeLinkObj(obj_dist){
            var downloads = []
            let url = ""
            let name =""
            let encodingFormats = ""
           if (hasSchemaProperty('url', obj_dist)) {
               url = schemaItem('url', obj_dist);
           } else if ( hasSchemaProperty('contentUrl',obj_dist) ) {
                url = schemaItem('contentUrl', obj_dist)
            }
            encodingFormats = schemaItem('encodingFormat', obj_dist)

           // if (hasSchemaProperty('name',obj_dist)){
           //     name = schemaItem('name', obj_dist)
           // } else {
           //     if (encodingFormats && Array.isArray(encodingFormats))
           //     {
           //          name = encodingFormats[0]
           //     } else {
           //         name = 'None Provided'
           //     }
           // }
            // there can be multiple encoding formats.
            // cant send back an array, or could but would require some
            // handling in way response is handled
            if (Array.isArray(encodingFormats)) {
                for (let e=0 ; e < encodingFormats.length; e++ )
                {
                   name = hasSchemaProperty('name',obj_dist)? schemaItem('name', obj_dist): encodingFormats[e];
                   downloads.push ({
                       distType: name,
                       contentUrl: url,
                       encodingFormat: encodingFormats[e],
                       name: name,
                       linkName:encodingFormats[e]
                   }
                )
                }
            } else {
                name = hasSchemaProperty('name',obj_dist)? schemaItem('name', obj_dist): encodingFormats;
                if (_.isEmpty(encodingFormats)) {
                    var linkName= name
                } else {
                    var linkName= encodingFormats
                }
                downloads.push ({
                    distType: name,
                    contentUrl: url,
                    encodingFormat: encodingFormats,
                    name: name,
                    linkName:linkName
                })
            }
            return downloads
        }
        // const compacted = jsonld.compact(obj, context).then(sC, fC);
        const compacted = jsonld.compact(content, context).then((providers) => {
            var j = JSON.stringify(providers, null, 2);
            var jp = JSON.parse(j);
            console.log(j.toString());
this.raw_json = j;
            const detailsTemplate = [];
            // detailsTemplate.push(html`<h3>Digital Document metadata</h3>`);
            this.s_name = schemaItem('name', jp);
            this.s_url = schemaItem('url', jp);
            this.s_description = schemaItem('description', jp);

            var s_distribution = schemaItem('distribution', jp);

            if (hasSchemaProperty('datePublished',jp)){
                this.s_datePublished = schemaItem('datePublished', jp);
            } else if (hasSchemaProperty('datePublished',s_distribution)) { // in distribution
                var s_datePublished = schemaItem('datePublished', s_distribution);
            }  else if (hasSchemaProperty('dateCreated',jp)) {
                this.s_datePublished = schemaItem('dateCreated', jp);
            }
             if (hasSchemaProperty('publisher',jp) ) {
                 var p = schemaItem('publisher', jp);
                 if (hasSchemaProperty('name',p)) {
                     this.publisher = schemaItem('name', p);
                 } else  if (hasSchemaProperty('legalName',p)){
                     this.publisher = schemaItem('legalName', p);
                 } else {
                     this.publisher ='Publsher Quirkiness. Please alert us'
                 }
             }
             else {
                 this.publisher = schemaItem('sdPublisher', jp);
             }
            //this.s_contributor = schemaItem('contributor', jp);
            if (hasSchemaProperty('contributor',jp) ) {
                var p = schemaItem('contributor', jp);
                if (Array.isArray(p)) {
                    this.s_contributor = p.map(function (obj) {
                            if (hasSchemaProperty('name', obj)) {
                                return schemaItem('name', obj) + ", "
                            }
                        }
                    )
                    console.log('contributor ' + this.s_contributor)

                } else {
                    this.s_contributor = schemaItem('name', p);
                }
            }
            if (hasSchemaProperty('creator',jp) ) {
                var p =  schemaItem('creator', jp);
                if (Array.isArray(p)){
                    this.s_contributor = p.map(function(obj){
                        if (hasSchemaProperty('name',obj)){
                            return schemaItem('name', obj) +", "
                        }}
                    )
                    console.log('contributor'+this.s_contributor)

                } else {
                    this.s_contributor = schemaItem('name', p);
                }

            }
            // else {
            //     this.s_contributor = schemaItem('contributor', jp);
            // }

            if (hasSchemaProperty('citation', jp)){
                this.s_citation = schemaItem('citation', jp);
                this.hide_citation_tab = false;
            }
            this.s_keywords = schemaItem('keywords', jp);
            this.s_landingpage = schemaItem('description', jp);
            //var s_distribution = schemaItem('distribution', jp); // moved up
            var dist_type = s_distribution['@type'];
            var encodingFormat = schemaItem('encodingFormat', s_distribution);
            var contentUrl = schemaItem('contentUrl', s_distribution);
            var distUrl = schemaItem('url', s_distribution);
            this.s_downloads = getDistributions(s_distribution, this.s_url)
            // let downloadsurl = contentUrl ? contentUrl : distUrl;
            // this.s_downloads = [{
            //     distType: dist_type,
            //     contentUrl: downloadsurl,
            //     encodingFormat: encodingFormat
            // }]
            let s_spatialCoverage = schemaItem('spatialCoverage', jp)
            let placename = geoplacename(s_spatialCoverage)
            let box = getFirstGeoShape(s_spatialCoverage, 'box')
            let poly = getFirstGeoShape(s_spatialCoverage, 'polygon')
            let points = getGeoCoordinates(s_spatialCoverage)
            console.info(`placename:${placename} box:${box} poly:${poly} points:${points}`)
            //this.s_identifier_doi= ""


            if (jp["https://schema.org/description"] || jp["http://schema.org/description"]) {
                detailsTemplate.push(html`
                    <details>
                        <summary>JSON-LD Object</summary>
                        <pre>${j}</pre>
                    </details>`);
            } else detailsTemplate.push(html`
                <div>No object available</div>`);

            let detail = {
                 name: this.s_name,
                points: points,
                poly: poly,
                box: box,
                placename: placename
            }
            const addMapEvent = new CustomEvent('addMap', {
                bubbles: false,
                detail: detail
            });
            this.updateComplete.then(() => {
                document.dispatchEvent(addMapEvent)
            });
        })

    }

    render() {
        let s_name = this.s_name;
        let html_name = html`${unsafeHTML(this.s_name)}`
        let s_url = this.s_url;
        let has_s_url = ! _.isEmpty(s_url)
        let s_description = this.s_description;
        let description =html`${unsafeHTML(this.s_description)}`
        let s_contributor = this.s_contributor;
        let s_publishedDate = this.s_datePublished;
        let s_publisher = this.publisher;
        let s_citation = this.s_citation;
        let hide_citation_tab = this.hide_citation_tab;
        let s_downloads = this.s_downloads;
        let raw_json = this.raw_json;


        const template = html` <!--  <obj-exchange></obj-exchange> -->

        <div class="col-8">
            <div class="row">
                <span class="font-weight-bold font-heavy my-4">  ${html_name} </span>
            </div>
            <div class="row">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="md-tab" data-toggle="tab" href="#md" role="tab"
                           aria-controls="md" aria-selected="true">Metadata</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="web-tab" data-toggle="tab" href="#web" role="tab"
                           aria-controls="web" aria-selected="true">Web Links</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="citation-tab" data-toggle="tab" href="#cite" role="tab"
                           aria-controls="cite" aria-selected="true" 
                            ?hidden="${hide_citation_tab}">Citation</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link " id="json-tab" data-toggle="tab" href="#json" role="tab"
                           aria-controls="json" aria-selected="true">Raw Metadata</a>
                    </li>
                </ul>
            </div>
            <div class="row">
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="md" role="tabpanel" aria-labelledby="md-tab">
                        <div class="row">

                            <span class="col-2 font-weight-bold">Type:</span>
                            <span class="col-8">Data</span>
                        </div>
                        <div class="row">

                            <span class="col-2 font-weight-bold">Abstract:</span>
                            <span class="col-8">
                          ${description}</span></div>

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
                    <div class="tab-pane fade" id="web" role="tabpanel" aria-labelledby="web-tab">
                        <div class="row">

                            <span class="col-4 font-weight-bold">Name</span>
                            <span class="col-8 font-weight-bold">link </span>

                        </div>
                        ${ has_s_url ? html`<div class="row" >

                            <span class="col-4">Object URL</span>
                            <a class="col-8" href="${s_url}" target="_blank"> ${s_url} </a>

                        </div>` : "" }
                        
                        ${this.s_downloads.map(i => html`
                          <div class="row">
                              <span class="col-4 ">${i.name}</span>
                              <a class="col-8" target="_blank" href="${i.contentUrl}">${i.contentUrl}</a>
                          </div> `)}


                    </div>
                    <div class="tab-pane fade" id="cite" role="tabpanel" aria-labelledby="cite-tab">
                        <div class="row">

                            <span class="col-4 font-weight-bold">Citation</span>

                            <a class="col-8" href="${s_citation}" target="_blank">${s_citation}</a>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="json" role="tabpanel" aria-labelledby="json-tab">
                        <div class="row">

                            <span class="col-4 font-weight-bold">JSON</span>

                            <pre>${raw_json}</pre>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <div class="col-4 ">

            <div class="row mt-4">
                <div id="mapid" style="width: 600px; height: 400px;">

                </div>
            </div>
            <div class="row font-weight-bold">Downloads</div>
            <div class="row">
                ${this.s_downloads.map(i => html`<a class="btn btn-info w-150" target="_blank" href="${i.contentUrl}">${i.linkName}</a>`)}

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



