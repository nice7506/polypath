/// <reference types="cypress" />

describe('PolyPath end-to-end happy path', () => {
  it('walks from configuration to roadmap using mocked backend', () => {
    // Mock /api/draft so we don't call the real backend/LLM.
    cy.intercept('POST', '**/api/draft', {
      statusCode: 200,
      body: {
        roadmapId: 'test-roadmap-1',
        strategies: [
          {
            name: 'Hands-on Project Strategy',
            weeks: 4,
            desc: 'Focuses on building real projects while learning fundamentals.',
            demoUrl: 'https://example.com/demo',
          },
        ],
      },
    }).as('draft')

    // Mock /api/realize to return logs + a small roadmap structure.
    cy.intercept('POST', '**/api/realize', {
      statusCode: 200,
      body: {
        success: true,
        sandboxId: 'sandbox-test-123',
        logs: [
          '> Strategy Selected: Hands-on Project Strategy',
          '> Starting Multi-Source Search...',
          '> Gemini successfully constructed roadmap.',
        ],
        final_roadmap: {
          title: 'Hands-on Project Strategy Roadmap',
          summary: 'A short, project-based path tailored for testing.',
          weeks: [
            {
              week: 1,
              focus: 'Week 1: Fundamentals',
              goals: ['Understand basics', 'Set up environment'],
              resources: [
                {
                  type: 'video',
                  title: 'Intro Video',
                  url: 'https://example.com/video',
                  summary: 'High-level overview video.',
                },
              ],
            },
          ],
        },
      },
    }).as('realize')

    // 1) Start at configuration
    cy.visit('/start')

    // Basic sanity: page heading present
    cy.contains(/Build Your Perfect Learning Path/i).should('be.visible')

    // Click the CTA to draft strategies
    cy.contains('button', /Draft Strategies/i).click()

    // Wait for mock /api/draft and assert navigation
    cy.wait('@draft')
    cy.url().should('include', '/select')
    cy.contains(/Choose Your Path/i).should('be.visible')
    cy.contains('Hands-on Project Strategy').should('be.visible')

    // 2) Select the strategy and go to realization
    cy.contains('button', /Select Strategy/i).click()
    cy.url().should('include', '/realization')

    // Wait for mock /api/realize
    cy.wait('@realize')

    // Logs from backend should appear in console
    cy.contains('Gemini successfully constructed roadmap.').should('be.visible')

    // 3) After console completes, user should be redirected to roadmap
    cy.url({ timeout: 8000 }).should('include', '/roadmap')
    cy.contains('Hands-on Project Strategy Roadmap').should('be.visible')
    cy.contains('Week 1: Fundamentals').should('be.visible')
    cy.contains('Intro Video').should('be.visible')
  })
})

