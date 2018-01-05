/**
 * Created by Bruce Colby on 6/15/17 at 3:01 PM.
 * @flow
 */

const moment = require('moment')

let state = {}

exports.wait = (id, cb, waitTimeMS = 500) => {
  if (!state[id]) {
    // init
    state[id] = {
      interval: null,
      timeout: null,
      callback: () => {}
    }

    state[id].interval = setInterval(() => {

      let ms = moment(state[id].timeout || moment(),"DD/MM/YYYY HH:mm:ss").diff(moment(moment(),"DD/MM/YYYY HH:mm:ss"));

      if (Math.abs(ms) >= waitTimeMS) {
        state[id].callback()
        clearInterval(state[id].interval)
        delete state[id]
      }
    }, 100)
  }

  state[id].callback = () => cb()
  state[id].timeout = moment()
}