//Perfect way to use cy.interface and cy.wait
cy.intercept(WAIT_APIS.agentSearch.endpoint).as(WAIT_APIS.agentSearch.alias);
if (deviceType === DeviceType.MOBILE) {
  cy.findByTitle("menu-open").parent().click();
}
cy.findByText("My Profile").click();
// eslint-disable-next-line jest/valid-expect-in-promise
cy.wait(`@${WAIT_APIS.agentSearch.alias}`)
  .its("response.body")
  .then((data) => {
    performAndWaitForApi(WAIT_APIS.agentSearch, () => {
      visit(`/people/${data.id}/agent-website-onboarding`);
    });
  });

assertMatchesRegex(`/people/${UUID_REGEX}/agent-website-onboarding`);

cy.findByText(`Real hosts your website for you!`).should("exist");

//Commands to use
//this contains allows partisial words as well.
cy.contains("Data").should("exist");

//get method
//this command will search for div element and also give how many div are available on that page.
cy.get("div");
