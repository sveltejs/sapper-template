import Index from '../../../routes/index.html'
import mountComponent from './mount-component'

describe('Index', () => {
  beforeEach(() => {
    mountComponent(Index, {})
  })

  it('high fives ✋', () => {
    cy.contains('HIGH FIVE')
  })
})
