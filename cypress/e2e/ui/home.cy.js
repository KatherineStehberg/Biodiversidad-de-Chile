describe('Página principal del proyecto', () => {
  beforeEach(() => {
    cy.visitHome()
  })

  it('Debe cargar correctamente', () => {
    cy.get('body').should('be.visible')
  })

  it('Debe validar la URL', () => {
    cy.url().should('include', 'localhost:3000')
  })

  it('Debe verificar que la página tenga un título', () => {
    cy.title().should('not.be.empty')
  })

  it('Debe tomar una captura de la página principal', () => {
    cy.screenshot('pagina-principal')
  })
})