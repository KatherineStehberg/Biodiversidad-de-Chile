describe('API de actividad sísmica', () => {
  it('GET /api/earthquakes responde 200 con estructura válida', () => {
    cy.request('GET', '/api/earthquakes').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers['content-type']).to.include('application/json')
      expect(response.body).to.have.property('chile')
      expect(response.body).to.have.property('world')
      expect(response.body.chile).to.be.an('array')
      expect(response.body.world).to.be.an('array')
    })
  })

  it('GET /api/earthquakes incluye campos requeridos en eventos de Chile', () => {
    cy.request('GET', '/api/earthquakes').then((response) => {
      if (response.body.chile.length > 0) {
        const quake = response.body.chile[0]
        expect(quake).to.have.property('id')
        expect(quake).to.have.property('magnitude')
        expect(quake).to.have.property('place')
        expect(quake).to.have.property('time')
        expect(quake).to.have.property('depth')
        expect(quake.magnitude).to.be.a('number')
        expect(quake.time).to.be.a('number')
        expect(quake.depth).to.be.a('number')
      }
    })
  })
})
