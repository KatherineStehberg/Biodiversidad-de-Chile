const HomePage = {
  visit() {
    cy.visitHome()
  },

  getHero() {
    return cy.get('header')
  },

  getCurrentUrl() {
    return cy.url()
  },

  getPageTitle() {
    return cy.title()
  },

  takeScreenshot() {
    cy.screenshot('pagina-principal')
  },
}

export default HomePage
