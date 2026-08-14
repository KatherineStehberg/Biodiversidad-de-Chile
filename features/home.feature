Feature: Página principal

  Scenario: Cargar la página principal
    Given el usuario abre la página principal
    Then debe ver el encabezado principal
    And el título de la página no debe estar vacío
