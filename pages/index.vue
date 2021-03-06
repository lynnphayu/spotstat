<template>
  <div class="container is-fluid">
    <div
      class="column is-two-thirds-tablet is-two-thirds-desktop is-one-third-widescreen is-one-quarter-fullhd"
    >
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-96x96">
                <img
                  class="is-rounded"
                  :src="image_url"
                  alt="Placeholder image"
                />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ display_name }}</p>
              <p class="subtitle is-6">{{ email }}</p>
            </div>
          </div>

          <div class="tabs">
            <ul>
              <li
                v-bind:class="{ 'is-active': stats_radar.selected }"
                v-on:click="tap"
              >
                <a>Statistics</a>
              </li>
              <li
                v-for="tab in Object.keys(personalization)"
                v-bind:class="{ 'is-active': personalization[tab].selected }"
                v-on:click="tap"
              >
                <a>{{ tab }}</a>
              </li>
            </ul>
          </div>
          <div v-for="listdata in Object.values(personalization)">
            <list :data="listdata"></list>
          </div>
          <div class="content" v-show="stats_radar.selected">
            <p>Recent</p>
            <radarvue :data="stats_radar.recent_tracks"></radarvue>
            <div class="is-divider"></div>
            <p>All time</p>
            <radarvue :data="stats_radar.all_time_tracks"></radarvue>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
var access_token = ''
import list from '@/components/item_list'
import radar from '@/components/radar'
import radarvue from '@/components/radarvue'
import { loadProgressBar } from 'axios-progress-bar'
import 'axios-progress-bar/dist/nprogress.css'
var myRadarChart

const options_handler = (url, data) => {
  return {
    method: 'GET',
    url: url,
    headers: { Authorization: 'Bearer ' + access_token },
    params: data,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  }
}

export default {
  middleware: 'authenticated',
  components: {
    list,
    radar,
    radarvue
  },
  data() {
    return {
      // display_name: '',
      // image_url: '',
      // email: '',
      personalization: {
        'Favourite Tracks': {
          data: [],
          selected: false,
          handler: this.get_favourite_tracks
        },
        'Top Artists': {
          data: [],
          selected: false,
          handler: this.get_top_artists
        },
        'Recently Played': {
          data: [],
          selected: false,
          handler: this.get_recently_play
        }
      },
      stats_radar: {
        recent_tracks: {
          id: [],
          audio_features: [],
          recap: []
        },
        all_time_tracks: {
          id: [],
          audio_features: [],
          recap: []
        },
        selected: true
      }
    }
  },
  asyncData({ query, req }) {
    access_token = document.cookie.slice(document.cookie.indexOf('=') + 1)
    return axios(options_handler('https://api.spotify.com/v1/me')).then(
      ({ data: { display_name, images, email } }) => ({
        display_name,
        email,
        image_url: images[0] ? images[0].url : ''
      })
    )
  },

  mounted() {
    loadProgressBar()
    // axios(options_handler('https://api.spotify.com/v1/me')).then(response => {
    //   this.display_name = response.data.display_name
    //   this.image_url = response.data.images[0].url
    //   this.email = response.data.email
    // })
    this.get_recently_play().then(this.reterive_audio_feature)
    this.get_favourite_tracks().then(this.reterive_audio_feature)
  },
  methods: {
    get_favourite_tracks() {
      return new Promise((resolve, reject) => {
        if (this.personalization['Favourite Tracks'].data.length == 0)
          axios(
            options_handler('https://api.spotify.com/v1/me/top/tracks', {
              limit: 15
            })
          ).then(({ data: { items } }) => {
            this.personalization['Favourite Tracks'].data = items
            this.stats_radar.all_time_tracks.id = items.map(el => el.id)
            resolve(this.stats_radar.all_time_tracks)
          })
        else resolve('Done.')
      })
    },
    get_top_artists() {
      if (this.personalization['Top Artists'].data.length == 0)
        axios(
          options_handler('https://api.spotify.com/v1/me/top/artists', {
            limit: 15
          })
        ).then(response => {
          this.personalization['Top Artists'].data = response.data.items
        })
    },
    get_recently_play() {
      return new Promise((resolve, reject) => {
        if (this.personalization['Recently Played'].data.length == 0)
          axios(
            options_handler(
              'https://api.spotify.com/v1/me/player/recently-played',
              {
                limit: 15
              }
            )
          ).then(({ data: { items } }) => {
            this.personalization['Recently Played'].data = items.map(el => {
              return el.track
            })
            this.stats_radar.recent_tracks.id = items.map(el => {
              return el.track.id
            })
            resolve(this.stats_radar.recent_tracks)
          })
        else resolve('Done.')
      })
    },
    tap(event) {
      if (event.target.text !== 'Statistics') {
        for (var key in this.personalization)
          if (key !== event.target.text)
            this.personalization[key].selected = false
          else {
            this.personalization[key].selected = true
            this.personalization[key].handler()
          }
        this.stats_radar.selected = false
      } else {
        this.stats_radar.selected = true
        Object.values(this.personalization).forEach(el => (el.selected = false))
      }
    },
    reterive_audio_feature(id_list) {
      var tracks_id_string = ''
      id_list.id.forEach((el, i) => {
        tracks_id_string += el
        if (i < id_list.id.length - 1) tracks_id_string += ','
      })
      axios(
        options_handler('https://api.spotify.com/v1/audio-features', {
          ids: tracks_id_string
        })
      ).then(({ data: { audio_features } }) => {
        var features = []
        audio_features.forEach(el => {
          features.push([
            el.acousticness,
            el.danceability,
            el.energy,
            el.instrumentalness,
            el.liveness,
            el.speechiness,
            el.valence
          ])
        })
        id_list.audio_features = features
        id_list.recap = this.get_audio_feature_mean(features)
        this.$emit('stats_loaded')
      })
    },
    get_audio_feature_mean(data_arr) {
      var sum = new Array(data_arr[0].length).fill(0)
      var el
      data_arr.forEach(el => {
        sum.forEach((ele, i) => {
          // console.log("sum " + i + " : "+sum[i] + " + "+el[i])
          return (sum[i] += el[i])
        })
      })
      return sum.map(el => el / data_arr.length)
    }
  },
  computed: {}
}
</script>

<style>
.container {
  width: 100%;
  padding: 10px 0;
  background: #0c0c0c;
  min-height: 100vh;
}
.card {
  background: #0c0c0c;
}
a,
p {
  color: white !important;
}
.is-active a {
  color: #21ae43 !important;
  border-bottom-color: #21ae43 !important;
}
#nprogress .bar {
  background: #21ae43 !important;
}

#nprogress .peg {
  box-shadow: 0 0 10px #21ae43, 0 0 5px #21ae43 !important;
}

#nprogress .spinner-icon {
  border-top-color: #21ae43 !important;
  border-left-color: #21ae43 !important;
}
</style>
