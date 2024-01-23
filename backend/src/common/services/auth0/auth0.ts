import { ManagementClient } from 'auth0'
import * as dotenv from 'dotenv'

dotenv.config({ path: __dirname + '/../.env' })

export default new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
})
