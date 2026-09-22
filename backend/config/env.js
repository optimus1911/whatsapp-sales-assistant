import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const backendDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectEnvPath = path.resolve(backendDirectory, '../../.env')
const backendEnvPath = path.resolve(backendDirectory, '../.env')

dotenv.config({ path: projectEnvPath })
dotenv.config({ path: backendEnvPath })