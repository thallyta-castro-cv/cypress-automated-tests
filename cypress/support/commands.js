Cypress.Commands.add('fillMandatoryFieldsAndSubmit', (firstName, lastName, email, text) => {
    cy.get('#firstName').type(firstName)
    cy.get('#lastName').type(lastName)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(text)
    cy.contains('button', 'Enviar').click()
})

Cypress.Commands.add('selectFileScript', (_path) => {
    cy.get('#file-upload')
        .should('not.have.value')
        .selectFile(_path )
        .should((input) => {
          expect(input[0].files[0].name).to.equal('example.json')
    })
})