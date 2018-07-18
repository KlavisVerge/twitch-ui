import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';

/**
 * @customElement
 * @polymer
 */
class TwitchUiApp extends PolymerElement {
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
        <a href=[[item.thumbnail_url]] target="_blank"><twitch-stream-app streamer=[[item.streamer]] thumbnailurl=[[item.thumbnail_url]] title=[[item.title]] viewercount=[[item.viewer_count]]></twitch-stream-app></a>
        <hr style="width: 100%;"/>
      </template>
    `;
  }
  static get properties() {
    return {
      gameName: {
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
      var data = {gameName: this.gameName};

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
        //TODO: update API to get username and not just ID
        let unparseStreams = JSON.parse(response.streams).data;
        for(var i = 0; i < unparseStreams.length; i++){
          unparseStreams[i].thumbnail_url = unparseStreams[i].thumbnail_url.replace('{width}', '248');
          unparseStreams[i].thumbnail_url = unparseStreams[i].thumbnail_url.replace('{height}', '140');
          let streamer = 'https://www.twitch.tv/'; // add user here
        }
        this.streams = unparseStreams;
      });
  }
}

window.customElements.define('twitch-ui-app', TwitchUiApp);
