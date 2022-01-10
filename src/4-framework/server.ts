/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-var-requires */
import app from './config/app'
require('dotenv').config()
const port = process.env.PORT
const server = app.listen(port, () => 'server running on port ' + port)
export default server
