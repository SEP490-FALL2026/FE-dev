import { validateOpenApiDocument } from './validate-openapi.mjs'

export default function validateOrvalInput(document) {
  validateOpenApiDocument(document)
  return document
}
