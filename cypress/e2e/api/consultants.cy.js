describe('API de consultores', () => {
  it('GET /api/consultants responde con una estructura válida', () => {
    cy.request('GET', '/api/consultants').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('consultants')
      expect(response.body.consultants).to.be.an('array')
    })
  })
})
