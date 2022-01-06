/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-var-requires */
import app from './config/app'
require('dotenv').config()
app.listen(process.env.PORT, () => 'server running on port ' + process.env.PORT)
