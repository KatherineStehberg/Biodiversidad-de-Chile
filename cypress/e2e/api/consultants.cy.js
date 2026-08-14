describe('API de consultores', () => {
  it('GET /api/consultants responde con una estructura válida', () => {
    cy.fixture('api/consultants-response.json').then((expectedShape) => {
      cy.request({
        method: 'GET',
        url: '/api/consultants',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')

        Object.keys(expectedShape).forEach((key) => {
          expect(response.body).to.have.property(key)
        })

        expect(response.body.consultants).to.be.an('array')
      })
    })
  })

  it('no expone consultores pendientes en la respuesta pública por defecto', () => {
    cy.request({
      method: 'GET',
      url: '/api/consultants',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.consultants).to.be.an('array')

      response.body.consultants.forEach((consultant) => {
        expect(consultant).to.have.property('isApproved', true)
      })
    })
  })
})
