import { App } from './app'
import { LinksRoute } from './routes/links.route'
import { RedirectRoute } from './routes/redirect.route'
import exp from 'constants'

const app = new App([new LinksRoute(), new RedirectRoute()])
app.listen()
