const axios = require('axios');
const qs = require('qs');

let token = {}

// Helper function to get the OAuth token from ACE API.
const getToken = async function () {
  let data = qs.stringify({
    'client_id': process.env.client_id,
    'client_secret': process.env.client_secret,
    'grant_type': 'client_credentials'
  });

  let config = {
    method: 'post',
    url: 'https://accounts.acquia.com/api/auth/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  }

  return axios(config).then(response => {
    token = response.data.access_token
  }).catch(error => {})
};

// Build the list of applications in a format accepted by Alfred "Script Filter" input.
const getApps = async function () {
  return axios({
    method: 'get',
    url: 'https://cloud.acquia.com/api/applications',
    headers: {
      'Authorization': `Bearer ${ token }`
    }
  }).then(response => {
    let apps = []
    for (const app of response.data._embedded.items) {
      apps.push({
        'title': app.name,
        'uid': app.uuid,
        'arg': app.uuid,
        'autocomplete': app.name
      })
    }
    return apps
  }).catch(error => {
    console.log(error)
    return []
  })
};

// Buld the list of environments for a given application in a format accepted by
// Alfred "Script Filter" input.
const getEnvironments = async function (uuid) {
  return axios({
    method: 'get',
    url: `https://cloud.acquia.com/api/applications/${ uuid }/environments`,
    headers: {
      'Authorization': `Bearer ${ token }`
    }
  }).then(response => {
    let envs = [{
      'title': 'Environments overview page',
  		'arg': '',
  		'uid': uuid + '-overview',
      'autocomplete': 'Environments overview page',
  		'icon': {
  			'path': './icons/stack.png'
  		}
    }]
    for (const env of response.data._embedded.items) {
      envs.push({
        'title': env.name,
        'uid': env.id,
        'arg': env.id,
        'autocomplete': env.name,
        'icon': {
          'path': './icons/env.png'
        }
      })
    }
    return envs
  }).catch(error => {
    console.log(error)
    return []
  })
};


(async() => {
  if (process.env.client_id === undefined || process.env.client_secret === undefined) {
    console.log('Client ID and secret are mandatory.')
  }

  await getToken()

  let apps = await getApps()

  let ps = []
  for (let app of apps) {
    let p = getEnvironments(app.uid).then(envs => {
      app.environments = envs
    })
    ps.push(p)
  }

  await Promise.all(ps)

  console.log(JSON.stringify(apps))
})();
