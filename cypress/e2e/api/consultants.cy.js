describe('API de consultores', () => {
  it('GET /api/consultants responde con una estructura válida', () => {
    cy.fixture('api/consultants-response.json').then((expectedShape) => {
      cy.request('GET', '/api/consultants').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')

        // Validar que todas las claves del fixture existen en la respuesta real
        Object.keys(expectedShape).forEach((key) => {
          expect(response.body).to.have.property(key)
        })

        expect(response.body.consultants).to.be.an('array')
      })
    })
  })
})
