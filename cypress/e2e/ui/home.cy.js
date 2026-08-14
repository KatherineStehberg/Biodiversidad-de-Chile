import HomePage from '../../support/pages/HomePage'

describe('Página principal del proyecto', () => {
  beforeEach(() => {
    HomePage.visit()
  })

  it('Debe cargar correctamente', () => {
    HomePage.getHero().should('be.visible')
  })

  it('Debe validar la URL', () => {
    HomePage.getCurrentUrl().should('include', 'localhost:3000')
  })

  it('Debe verificar que la página tenga un título', () => {
    HomePage.getPageTitle().should('not.be.empty')
  })

  it('Debe tomar una captura de la página principal', () => {
    HomePage.takeScreenshot()
  })
})
