import { test } from '@japa/runner'

function isSafeInput(input: string): boolean {
  const sqlInjectionPattern = /('|--|;|\/\*|\*\/|xp_)/i
  return !sqlInjectionPattern.test(input)
}

test.group('InputValidator - isSafeInput', () => {
  test('retourne true pour un input normal', ({ assert }) => {
    assert.isTrue(isSafeInput('test@test.fr'))
  })

  test('retourne false pour une tentative SQL injection', ({ assert }) => {
    assert.isFalse(isSafeInput("' OR 1=1;--"))
  })
})
