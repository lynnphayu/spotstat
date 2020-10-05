<template>
  <div class="container Aligner">
    <div>
      <span class="button is-success is-rounded">
        <strong>Authenticate</strong>
      </span>
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
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    },
  }
}

export default {
  components: {},
  data() {},

  mounted() {},
  computed: {},
}
</script>

<style>
.container {
  width: 100%;
  padding: 10px 0;
  background: #0c0c0c;
  min-height: 100vh;
}
.Aligner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.Aligner-item {
  max-width: 50%;
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
