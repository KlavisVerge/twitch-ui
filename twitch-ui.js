import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {} from '@polymer/polymer/lib/elements/dom-if.js';
import "@polymer/iron-image/iron-image.js";
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "twitch-stream/twitch-stream.js";

/**
 * `twitch-ui`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TwitchUi extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          align-items: center;
          text-align: center;
        }

        .wrapper {
          padding: 15px 0 15px 0;
          width: 100%;
        }

        paper-card {
          width: 100%;
        }

        paper-button {
          color: var(--paper-blue-900);
        }

        paper-button.custom:hover {
          background-color: var(--paper-light-blue-50);
        }

        .padding-class {
          padding: 15px 0 15px 0;
        }
      </style>
      <paper-spinner id="spinner" active=[[active]]></paper-spinner>
      <paper-item><h3>[[gameDisplayName]] - Popular Streams</h3></paper-item>
      <div class="wrapper">
        <paper-card>
          <div class="wrapper">
            <iron-image src="[[imgsrc]]"></iron-image>
          </div>
        </paper-card>
      </div>

      <template is="dom-repeat" items="[[initialstreams]]">
        <div class="wrapper">
          <paper-card>
            <div class="padding-class">
              <a href=[[item.channel.url]] target="_blank"><twitch-stream streamer=[[item.channel.display_name]] thumbnailurl=[[item.preview.medium]] title=[[item.channel.status]] viewercount=[[item.viewers]]></twitch-stream></a>
            </div>
          </paper-card>
        </div>
      </template>
      <template is="dom-if" if="[[streamsexceed]]">
        <paper-button on-tap="_showRest" class="custom">Show More</paper-button>
      </template>
    `;
  }
  static get properties() {
    return {
      gamename: {
        type: String,
        value: 'fortnite'
      },
      active: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      imgsrc: {
        type: String
      },
      initialstreams: {
        type: Array
      },
      streams: {
        type: Array
      },
      streamsexceed: {
        type:  Boolean,
        reflectToAttribute: true,
        value: false
      }
    };
  }

  ready() {
    super.ready();
    var url = 'https://xupmhdl2g5.execute-api.us-east-1.amazonaws.com/api/twitch-api?gameName=' + this.gamename;
    let err = false;

    fetch(url, {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => {
      this.$.spinner.active = false;
      console.error('Error:', error);
      err = true;
    })
    .then(response => {
      if(err){
        return;
      }
      let img = response.game.data[0].box_art_url.replace('{width}', '170');
      img = img.replace('{height}', '226');
      this.imgsrc = img;
      this.gameDisplayName = response.game.data[0].name;
      this.$.spinner.active = false;
      this.streams = JSON.parse(response.liveStreams).streams;
      if(this.streams.length > 2){
        this.streamsexceed = true;
        this.initialstreams = this.streams.slice(0, 2);
      }
    });
  }

  _showRest() {
    this.initialstreams = this.initialstreams.concat(this.streams.slice(2, this.streams.length));
    this.streamsexceed = false;
  }
}

window.customElements.define('twitch-ui', TwitchUi);
