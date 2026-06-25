describe('Página principal del proyecto', () => {
  it('Debe cargar correctamente', () => {
    cy.visit('http://localhost:3000')
    cy.get('body').should('be.visible')
  })

  it('Debe validar la URL', () => {
    cy.visit('http://localhost:3000')
    cy.url().should('include', 'localhost:3000')
  })

  it('Debe verificar que la página tenga un título', () => {
    cy.visit('http://localhost:3000')
    cy.title().should('not.be.empty')
  })

  it('Debe tomar una captura de la página principal', () => {
    cy.visit('http://localhost:3000')
    cy.get('body').should('be.visible')
    cy.screenshot('pagina-principal')
  })
})