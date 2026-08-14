describe('API de clima y mediciones ambientales', () => {
  it('GET /api/climate responde 200 con estructura de contrato válida', () => {
    cy.fixture('api/climate-response.json').then((expectedShape) => {
      cy.request('GET', '/api/climate').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')

        Object.keys(expectedShape).forEach((key) => {
          expect(response.body).to.have.property(key)
        })

        expect(response.body.co2.value).to.be.a('string')
        expect(parseFloat(response.body.co2.value)).to.be.above(0)
        expect(response.body.temperature.anomaly).to.be.a('string')
      })
    })
  })

  it('GET /api/weather responde 200 con estructura válida para coordenadas fijas', () => {
    cy.fixture('api/weather-response.json').then((expectedShape) => {
      cy.request('GET', '/api/weather?lat=-33.45&lon=-70.66').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers['content-type']).to.include('application/json')

        Object.keys(expectedShape).forEach((key) => {
          expect(response.body).to.have.property(key)
        })

        expect(response.body.temperature).to.be.a('number')
        expect(response.body.humidity).to.be.a('number')
        expect(response.body.windSpeed).to.be.a('number')
      })
    })
  })
})
