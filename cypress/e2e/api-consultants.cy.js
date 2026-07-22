describe('API GET /api/consultants', () => {
  it('responde 200 y entrega el contrato público esperado', () => {
    cy.request({
      method: 'GET',
      url: '/api/consultants',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('consultants')
      expect(response.body.consultants).to.be.an('array')
    })
  })

  it('no expone consultores pendientes en la respuesta pública por defecto', () => {
    cy.request('/api/consultants').then((response) => {
      expect(response.body.consultants).to.be.an('array')

      response.body.consultants.forEach((consultant) => {
        expect(consultant).to.have.property('isApproved', true)
      })
    })
  })
})
