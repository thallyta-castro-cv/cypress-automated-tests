/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {
    const THREE_SECONDS_IN_MS = 3000;

    beforeEach(() => {
        cy.visit('./src/index.html');
    })

    it('check the application title', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Fill in the required fields and submit the form', () => {
        const longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
       
        cy.clock()
        cy.get('#firstName').type('Thallyta')
        cy.get('#lastName').type('Castro')
        cy.get('#email').type('thallyta@gmail.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    it('displays error message when submitting the form with an email with invalid formatting', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit('Thallyta', 'Castro', 'thallyta@gmail,com', 'Teste')
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    
    it('phone field remains empty when filled with non-numeric value', () =>{
        cy.get('#phone')
            .type('texto')
            .should('have.value', '') 
    })

    it('displays error message when phone becomes mandatory but message is not populated before form submission', () => {
        cy.clock()
        cy.get('#firstName').type('Thallyta')
        cy.get('#lastName').type('Castro')
        cy.get('#email').type('thallyta@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('fills and clears the name, surname, email and phone fields', () => {
        cy.get('#firstName')
          .type('Thallyta')
          .should('have.value', 'Thallyta')
          .clear()
          .should('have.value', '')
        cy.get('#lastName')
          .type('Castro')
          .should('have.value', 'Castro')
          .clear()
          .should('have.value', '')
        cy.get('#email')
          .type('thallyta@gmail.com')
          .should('have.value', 'thallyta@gmail.com')
          .clear()
          .should('have.value', '')
        cy.get('#phone')
          .type('99985541')
          .should('have.value', '99985541')
          .clear()
          .should('have.value', '')
    });

    it('displays error message when submitting the form without filling the required fields', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    });

    it('successfully submit the form using a custom command', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit('Thallyta', 'Castro', 'thallyta@gmail.com', 'Teste')
        cy.get('.success').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.success').should('not.be.visible')
    });

    it('Select a product (Youtube) by its text', () => {
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    });

    it('Select a product (Mentoria) by its value', () => {
        const value = 'mentoria';
        cy.get('#product')
          .select(value)
          .should('have.value', value)   
    });

    it('Select a product (Blog) by its index', () => {
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')
    });

    it('Marks the type of service "feedback"  ', () => {
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('have.value', 'feedback')
    });

    it('Marks each type of service', () => {
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(($radio) => {
              cy.wrap($radio).check()
              cy.wrap($radio).should('be.checked')
          }) 
    });

    it('check both checkboxes and uncheck the last one', () => {
       cy.get('input[type="checkbox"]')
         .check()
         .should('be.checked')
         .last()
         .uncheck()
         .should('not.be.checked')
    });

    it('Seleciona um arquivo da pasta fixtures', () => {
        cy.selectFileScript('./cypress/fixtures/example.json')
    });

    it('select a file simulating a drag-and-drop', () => {
        cy.selectFileScript('cypress/fixtures/example.json', { action: 'drag-drop'})
    });

    it('select a file using a fixture given an alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('@sampleFile')
            .should((input) => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    });

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
    })

    it('fill the text area using the invoke command', () => {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
        .invoke('val', longText)
        .should('have.value', longText)
    });

    it('Makes an HTTP request', () => {
       cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
         .should( (response) => {
            const {status, statusText, body} = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
         })

    });
})

