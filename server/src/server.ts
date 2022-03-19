import express from 'express'
import cors from 'cors'
import tcpPortUsed from 'tcp-port-used'
import { prompt } from 'inquirer'

async function start(port = 5000): Promise<void> {
  try {
    const portIsUsed = await tcpPortUsed.check(port, 'localhost')

    if (portIsUsed) {
      const { shouldIncrementPort } = await prompt<{
        shouldIncrementPort: boolean
      }>([
        {
          type: 'confirm',
          name: 'shouldIncrementPort',
          message: `Port ${port} is already in use.\nWould you like to try port ${
            port + 1
          }?`,
        },
      ])

      if (shouldIncrementPort) {
        start(++port)
      } else {
        process.exit()
      }
    } else {
      const server = express()

      server.use(cors({ origin: 'http://localhost:3000' }))

      server.get('/hello-world', (request, response) => {
        response.send({ message: 'hello world' })
      })

      server.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`)
      })
    }
  } catch (error) {
    console.error(error)
  }
}

start()
