/*! withcabin.com 0.5.6 */

;(async function (window, document, host) {
	// Use a custom domain or not
	host = host[0] === '{' ? 'ping.withcabin.com' : host

	const nav = window.navigator

	// Kill requests from bots and spiders
	if (nav.userAgent.search(/(bot|spider|crawl)/gi) > -1) {
		return
	}
	const send = (url) => {
		const xhr = new XMLHttpRequest()
		return new Promise((resolve, reject) => {
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					resolve(parseFloat(xhr.response))
				}
			}
			xhr.open('GET', url)
			xhr.send()
		})
	}

	const disable = 'disableCabin',
		ael = 'addEventListener',
		cache = '/cache?',
		ps = 'pushState',
		sb = 'sendBeacon',
		tm = 'timing'

	const loc = window.location
	const perf = window.performance
	const screen = window.screen

	const url = 'https://' + host
	const now = () => Date.now()
	const add = () => (duration += now() - snapshot)

	const params = (data) =>
		Object.keys(data)
			.map((key) => `${key}=${encodeURIComponent(data[key])}`)
			.join('&')

	const beacon = (url, data) => {
		if (nav[sb]) {
			nav[sb](url, JSON.stringify(data))
		} else {
			return send(`${url}?${params(data)}`)
		}
	}

	let start, snapshot, duration, data

	const pageview = async () => {
		if (window[disable]) {
			delete window[disable]
			return
		}
		delete window[disable]

		start = now()
		snapshot = start
		duration = 0

		// Get the load time
		let time =
			perf && perf[tm]
				? perf[tm].domContentLoadedEventEnd - perf[tm].navigationStart
				: 0

		// set data package
		data = {
			r: document.referrer,
			w: screen.width,
			s: 0, // temporary placeholder
			t: time > 0 ? time : 0,
			p: loc.href,
		}

		let h = loc.hostname
		let p = loc.pathname

		await Promise.all([
			send(url + cache + h).then((u) => {
				data.u = u
			}),
			send(url + cache + h + p).then((up) => {
				data.up = up
			}),
		])

		send(url + '/hello?' + params(data))
	}

	document[ael]('visibilitychange', () => {
		document.hidden ? add() : (snapshot = now())
	})

	const sendDuration = async () => {
		if (window[disable]) {
			return
		}
		!document.hidden ? add() : null
		await beacon(url + '/duration', { d: duration, n: start, p: loc.href })
	}
	// log the pageview duration
	window[ael]('beforeunload', sendDuration)

	let _pushState = function (type) {
		let original = history[type]
		return function () {
			let r = original.apply(this, arguments),
				e
			if (typeof Event == 'function') {
				e = new Event(type)
			} else {
				e = doc.createEvent('Event')
				e.initEvent(type, true, true)
			}
			e.arguments = arguments
			window.dispatchEvent(e)
			return r
		}
	}

	window.history[ps] = _pushState(ps)

	window[ael](ps, () => {
		sendDuration()
		pageview()
	})
	window[ael]('popstate', () => {
		sendDuration()
		pageview()
	})

	// add global object for capturing events
	window.cabin = {
		async event(value, callback) {
			add()
			const data = {
				e: value,
				p: loc.href,
				d: duration,
				n: start,
			}
			await beacon(url + '/event', data)
			callback && callback()
		},
	}
	pageview()
})(window, document, '{{.Host}}')
