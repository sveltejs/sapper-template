export default function mountComponent(Component, data) {
  const html = `
    <div id="app"></div>
    `
  const document = cy.state('document')
  document.write(html)
  document.close()

  cy.get('#app', { log: false }).should('exist')
  return cy.document({ log: false }).then(doc => {
    Cypress.component = new Component({
      target: doc.getElementById('app'),
      data,
    })
    copyStyles(Component)
  })
}

// having weak reference to styles prevents garbage collection
// and "losing" styles when the next test starts
const stylesCache = new Map()

function copyStyles(component) {
  const hash = component

  let styles = document.querySelectorAll('head style')
  if (styles.length) {
    console.log('injected %d styles', styles.length)
    stylesCache.set(hash, styles)
  } else {
    console.log('No styles injected for this component, checking cache')
    if (stylesCache.has(hash)) {
      styles = stylesCache.get(hash)
    } else {
      styles = null
    }
  }

  if (!styles) {
    return
  }

  const parentDocument = window.parent.document
  const projectName = Cypress.config('projectName')
  const appIframeId = `Your App: '${projectName}'`
  const appIframe = parentDocument.getElementById(appIframeId)
  const head = appIframe.contentDocument.querySelector('head')
  styles.forEach(style => {
    head.appendChild(style)
  })
}
