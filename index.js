const fs = require('fs')
const merge = require('merge-deep')

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

let data = merge(jsonOriginal, jsonOverride)

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
	let apps = data.filter(app => {
		return app.uid == process.env.app
	})

	if (!apps.length) {
		return
	}

	items = apps[0].environments || []
}
// If the app and the env rare defined, list the possible pages.
else if (process.env.app !== undefined && process.env.env !== undefined) {
	items.push({
		'title': 'Overview',
		'arg': '',
		'uid': process.env.env + '-overview',
		'autocomplete': 'Overview',
		'icon': {
			'path': './icons/overview.png'
		}
	})
	items.push({
		'title': 'Servers',
		'arg': 'servers',
		'uid': process.env.env + '-servers',
		'autocomplete': 'Servers',
		'icon': {
			'path': './icons/servers.png'
		}
	})
	items.push({
		'title': 'Databases',
		'arg': 'databases',
		'uid': process.env.env + '-databases',
		'autocomplete': 'Databases',
		'icon': {
			'path': './icons/databases.png'
		}
	})
	items.push({
		'title': 'Domain management',
		'arg': 'domain-management',
		'uid': process.env.env + '-domains',
		'autocomplete': 'Domain management',
		'icon': {
			'path': './icons/domains.png'
		}
	})
	items.push({
		'title': 'Logs',
		'arg': 'logs',
		'uid': process.env.env + '-logs',
		'autocomplete': 'Logs',
		'icon': {
			'path': './icons/logs.png'
		}
	})
	items.push({
		'title': 'Scheduled jobs',
		'arg': 'cron',
		'uid': process.env.env + '-cron',
		'autocomplete': 'Scheduled jobs',
		'icon': {
			'path': './icons/cron.png'
		}
	})
	items.push({
		'title': 'Configuration',
		'arg': 'config',
		'uid': process.env.env + '-config',
		'autocomplete': 'Configuration',
		'icon': {
			'path': './icons/config.png'
		}
	})
}

console.log(JSON.stringify({"items": items}))
