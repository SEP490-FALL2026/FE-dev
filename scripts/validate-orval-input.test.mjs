import assert from 'node:assert/strict'
import test from 'node:test'

import validateOrvalInput from './validate-orval-input.mjs'

test('rejects an invalid contract before generating and preserves a valid one', () => {
  const valid = {
    openapi: '3.0.0',
    info: { version: 'test' },
    tags: [{ name: 'test' }],
    paths: { '/test': { get: { operationId: 'test', tags: ['test'], responses: {} } } }
  }
  assert.equal(validateOrvalInput(valid), valid)
  assert.throws(() => validateOrvalInput({}))
  assert.throws(() => validateOrvalInput({ ...valid, paths: { '/test': { get: { tags: ['test'] } } } }))
})
