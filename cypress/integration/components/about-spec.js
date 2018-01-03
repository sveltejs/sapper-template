import About from '../../../routes/about.html'
import mountComponent from './mount-component'

describe('About', () => {
  beforeEach(() => {
    mountComponent(About, {})
  })

  it('shows title', () => {
    cy.contains('h1', 'About this site')
  })

  it('has 3 links', () => {
    cy.get('nav a').should('have.length', 3)
  })

  it('has About link selected', () => {
    cy.contains('a', 'about').should('have.class', 'selected')
  })
})
