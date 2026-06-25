describe('Interceptación de API de usuarios', () => {
  it('Debe interceptar la solicitud GET y validar respuesta 200', () => {
    cy.intercept('GET', '/api/usuarios').as('getUsuarios')

    cy.visit('http://localhost:3000')

    cy.wait('@getUsuarios').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      expect(interception.response.body.length).to.be.greaterThan(0)
    })
  })
})