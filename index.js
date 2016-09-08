module.exports = app => {
	let getSitemapURLs = () => {
		let prefix = '/'

		if(app.config.domain)
			prefix = app.server.protocol + '://' + app.config.domain + '/'

		let urlList = []

		for(let page of app.pages.values()) {
			urlList.push(prefix + page.url)
		}

		urlList.sort()
		return urlList
	}

	app.get('sitemap.txt', (request, response) => {
		let urlList = getSitemapURLs()

		response.writeHead(200)
		response.end(urlList.join('\n'))
	})

	app.get('sitemap.xml', (request, response) => {
		let urlSet = getSitemapURLs().map(url => `<url><loc>${url}</loc></url>`).join()

		response.writeHead(200)
		response.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSet}</urlset>`)
	})

	app.get('robots.txt', (request, response) => {
		let sitemapURL = '/sitemap.xml'

		if(app.config.domain)
			sitemapURL = `${app.server.protocol}://${app.config.domain}/sitemap.xml`

		response.writeHead(200)
		response.end(`User-agent: *\nDisallow: /_/\nAllow: /\nSitemap: ${sitemapURL}`)
	})
}