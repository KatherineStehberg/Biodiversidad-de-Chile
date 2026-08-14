describe('Casos negativos de API', () => {
  it('GET /api/ruta-inexistente responde 404', () => {
    cy.request({
      method: 'GET',
      url: '/api/ruta-que-no-existe',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })

  it('POST /api/consultants sin autenticación responde 401', () => {
    cy.request({
      method: 'POST',
      url: '/api/consultants',
      body: { nombre: 'Test' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('error')
    })
  })

  it('POST /api/offers sin autenticación responde 401', () => {
    cy.request({
      method: 'POST',
      url: '/api/offers',
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body).to.have.property('error')
    })
  })
})
