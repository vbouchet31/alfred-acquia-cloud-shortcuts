const fs = require('fs')

// Prepare the data which will be used by the workflow.
let jsonOriginal = {}
let jsonOverride = {}

try {
	if (fs.existsSync(`${ process.env.alfred_workflow_data }/data.json`)) {
		let rawOrignal = fs.readFileSync(`${ process.env.alfred_workflow_data }/data.json`)
		jsonOriginal = JSON.parse(rawOrignal)
	}

	if (fs.existsSync(`${ process.env.alfred_workflow_data }/overwrite.json`)) {
		let rawOverride = fs.readFileSync(`${ process.env.alfred_workflow_data }/overwrite.json`)
		jsonOverride = JSON.parse(rawOverride)
	}
}
catch (err) {
	console.log('Something wrong happened. Try to execute ace-refresh or to check overwrite.json file.')
}

let data = [];

for(let i = 0; i<jsonOriginal.length; i++) {
  data.push({
   ...jsonOriginal[i],
   ...(jsonOverride.find((itmInner) => itmInner.uid === jsonOriginal[i].uid))}
  );
}

let app = {}
let env = {}

if (process.env.app !== undefined) {
	let apps = data.filter(app => {
		return app.uid == process.env.app
	})

	app = apps[0]
}
if (process.env.env !== undefined) {
	let envs = app.environments.filter(env => {
		return env.uid == process.env.env
	})

	env = envs[0]
}

let items = []

// If the app is not defined, it is step 1, list the possible apps.
if (process.env.app === undefined) {
	for (const app of data) {
		if (app.hide) {
			continue
		}

		items.push(app)
	}
}
// If the app is defined but not the env, list the possible envs for the given app.
else if (process.env.app !== undefined && process.env.env === undefined) {
	let envs = [{
		'title': 'Environments overview page',
		'subtitle': `Open the ${ app.title } overview page.`,
		'arg': '',
		'autocomplete': 'Environments overview page',
		'icon': {
			'path': './icons/stack.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/applications/${ app.uid }`,
			'largetype': `https://cloud.acquia.com/a/applications/${ app.uid }`,
		}
	}]

	items = envs.concat(app.environments || [])
}
// If the app and the env rare defined, list the possible pages.
else if (process.env.app !== undefined && process.env.env !== undefined) {
	items.push({
		'title': 'Overview',
		'subtitle': 'Open the overview page of the ' + env.title + ' environment.',
		'arg': '',
		'autocomplete': 'Overview',
		'icon': {
			'path': './icons/overview.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }`,
		}
	})
	items.push({
		'title': 'Servers',
		'subtitle': 'Open the servers page of the ' + env.title + ' environment.',
		'arg': 'servers',
		'autocomplete': 'Servers',
		'icon': {
			'path': './icons/servers.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }/servers`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }/servers`,
		}
	})
	items.push({
		'title': 'Databases',
		'subtitle': 'Open the databases page of the ' + env.title + ' environment.',
		'arg': 'databases',
		'autocomplete': 'Databases',
		'icon': {
			'path': './icons/databases.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }/databases`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }/databases`,
		}
	})
	items.push({
		'title': 'Domain management',
		'subtitle': 'Open the domain management page of the ' + env.title + ' environment.',
		'arg': 'domain-management',
		'autocomplete': 'Domain management',
		'icon': {
			'path': './icons/domains.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }/domain-management`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }/domain-management`,
		}
	})
	items.push({
		'title': 'Logs',
		'subtitle': 'Open the logs page of the ' + env.title + ' environment.',
		'arg': 'logs',
		'autocomplete': 'Logs',
		'icon': {
			'path': './icons/logs.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }/logs`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }/logs`,
		}
	})
	items.push({
		'title': 'Scheduled jobs',
		'subtitle': 'Open the scheduled jobs page of the ' + env.title + ' environment.',
		'arg': 'cron',
		'autocomplete': 'Scheduled jobs',
		'match': 'Scheduled jobs cron tasks',
		'icon': {
			'path': './icons/cron.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }/cron`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }/cron`,
		}
	})
	items.push({
		'title': 'Configuration',
		'subtitle': 'Open the configuration page of the ' + env.title + ' environment.',
		'arg': 'config',
		'autocomplete': 'Configuration',
		'icon': {
			'path': './icons/config.png'
		},
		'text': {
			'copy': `https://cloud.acquia.com/a/environments/${ env.uid }/config`,
			'largetype': `https://cloud.acquia.com/a/environments/${ env.uid }/config`,
		}
	})
}

console.log(JSON.stringify({"items": items}))
