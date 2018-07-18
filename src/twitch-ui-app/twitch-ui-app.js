import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

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
          justify-content: center;
          text-align: center;
        }
      </style>
      <paper-spinner id="spinner" active=[[active]]></paper-spinner>
      <iron-image src="[[imgsrc]]"></iron-image>
      <paper-item>[[gameDisplayName]]</paper-item>
      <iron-image src="[[imgsrc1]]"></iron-image>
      <paper-item>Title: [[title1]]</paper-item>
      <paper-item>Viewer Count: [[viewerCount1]]</paper-item>
      <paper-item>Started at: [[startedAt1]]</paper-item>
      <hr/>

      <iron-image src="[[imgsrc2]]"></iron-image>
      <paper-item>Title: [[title2]]</paper-item>
      <paper-item>Viewer Count: [[viewerCount2]]</paper-item>
      <paper-item>Started at: [[startedAt2]]</paper-item>
      <hr/>
      
      <iron-image src="[[imgsrc3]]"></iron-image>
      <paper-item>Title: [[title3]]</paper-item>
      <paper-item>Viewer Count: [[viewerCount3]]</paper-item>
      <paper-item>Started at: [[startedAt3]]</paper-item>
      <hr/>
      
      <iron-image src="[[imgsrc4]]"></iron-image>
      <paper-item>Title: [[title4]]</paper-item>
      <paper-item>Viewer Count: [[viewerCount4]]</paper-item>
      <paper-item>Started at: [[startedAt4]]</paper-item>
      <hr/>
      
      <iron-image src="[[imgsrc5]]"></iron-image>
      <paper-item>Title: [[title5]]</paper-item>
      <paper-item>Viewer Count: [[viewerCount5]]</paper-item>
      <paper-item>Started at: [[startedAt5]]</paper-item>
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
      imgsrc1: {
        type: String
      },
      imgsrc2: {
        type: String
      },
      imgsrc3: {
        type: String
      },
      imgsrc4: {
        type: String
      },
      imgsrc5: {
        type: String
      },
      gameDisplayName: {
        type: String
      },
      title1: {
        type: String
      },
      viewerCount1: {
        type: String
      },
      startedAt1: {
        type: String
      },
      title2: {
        type: String
      },
      viewerCount2: {
        type: String
      },
      startedAt2: {
        type: String
      },
      title3: {
        type: String
      },
      viewerCount3: {
        type: String
      },
      startedAt3: {
        type: String
      },
      title4: {
        type: String
      },
      viewerCount4: {
        type: String
      },
      startedAt4: {
        type: String
      },
      title5: {
        type: String
      },
      viewerCount5: {
        type: String
      },
      startedAt5: {
        type: String
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
        //TODO: refactor below as in rip out the duplication into its own component to prevent all this imgsrc1, imgsrc2, etc..
        let streams = JSON.parse(response.streams);
        for(var i = 0; i < 5; i++){
          if(i > streams.data.length){
            break;
          }
          let img = streams.data[i].thumbnail_url.replace('{width}', 248);;
          img = img.replace('{height}', 140);
          if(i === 0){
            this.imgsrc1 = img;
            this.title1 = streams.data[i].title;
            this.viewerCount1 = streams.data[i].viewer_count;
            this.startedAt1 = new Date(streams.data[i].started_at);
          } else if(i === 1){
            this.imgsrc2 = img;
            this.title2 = streams.data[i].title;
            this.viewerCount2 = streams.data[i].viewer_count;
            this.startedAt2 = new Date(streams.data[i].started_at);
          } else if(i === 2){
            this.imgsrc3 = img;
            this.title3 = streams.data[i].title;
            this.viewerCount3 = streams.data[i].viewer_count;
            this.startedAt3 = new Date(streams.data[i].started_at);
          } else if(i === 3){
            this.imgsrc4 = img;
            this.title4 = streams.data[i].title;
            this.viewerCount4 = streams.data[i].viewer_count;
            this.startedAt4 = new Date(streams.data[i].started_at);
          } else if(i === 4){
            this.imgsrc5 = img;
            this.title5 = streams.data[i].title;
            this.viewerCount5 = streams.data[i].viewer_count;
            this.startedAt5 = new Date(streams.data[i].started_at);
          }
        }
      });
  }
}

window.customElements.define('twitch-ui-app', TwitchUiApp);
