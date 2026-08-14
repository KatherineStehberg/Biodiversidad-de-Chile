/// <reference types="cypress" />

Cypress.Commands.add('visitHome', () => {
  cy.visit('/')
})

declare global {
  namespace Cypress {
    interface Chainable {
      visitHome(): Chainable<void>
    }
  }
}

export {}
