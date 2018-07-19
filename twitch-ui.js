import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import "@polymer/iron-image/iron-image.js"
import "@polymer/paper-item/paper-item.js"
import "@polymer/paper-spinner/paper-spinner.js"
import "twitch-stream/twitch-stream.js"

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
      </style>
      <paper-spinner id="spinner" active=[[active]]></paper-spinner>
      <iron-image src="[[imgsrc]]"></iron-image>
      <paper-item>[[gameDisplayName]] - Popular Streams</paper-item>

      <template is="dom-repeat" items="[[streams]]">
        <a href=[[item.channel.url]] target="_blank"><twitch-stream-app streamer=[[item.channel.display_name]] thumbnailurl=[[item.preview.medium]] title=[[item.channel.status]] viewercount=[[item.viewers]]></twitch-stream-app></a>
        <hr style="width: 100%;"/>
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
      streams: {
        type: Array
      }
    };
  }

  ready() {
    super.ready();
    var url = 'https://3oemw4weak.execute-api.us-east-1.amazonaws.com/api/twitch-api';
      var data = {gameName: this.gamename};

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => {
        this.$.spinner.active = false;
        console.error('Error:', error);
      })
      .then(response => {
        let img = response.game.data[0].box_art_url.replace('{width}', '170');
        img = img.replace('{height}', '226');
        this.imgsrc = img;
        this.gameDisplayName = response.game.data[0].name;
        this.$.spinner.active = false;
        this.streams = JSON.parse(response.liveStreams).streams;
      });
  }
}

window.customElements.define('twitch-ui', TwitchUi);
