Cypress._.times(3, () => {
   it('independently tests the privacy policy page', () => {
      cy.visit('./src/privacy.html')  
      cy.contains('Talking About Testing').should('be.visible')
   });
})