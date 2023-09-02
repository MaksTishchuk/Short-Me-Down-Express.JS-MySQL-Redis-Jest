import { App } from './app'
import { LinksRoute } from './routes/links.route'
import { RedirectRoute } from './routes/redirect.route'

const app = new App([new LinksRoute(), new RedirectRoute()])
app.listen()
