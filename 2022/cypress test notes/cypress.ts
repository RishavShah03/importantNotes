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

//Search for that particular id 'div'
cy.get("div#root").should("exist");

cy.get("div#noroot").should("not.exist");

cy.get("div[id=root]").should("exist");

//'Start Learning' a button
//Way 1
cy.get("Start Learning"); //Not proper way of writting, what if the name of button change

//Way 2
cy.get(".(class_name) > div > a"); //() -> represents varriable   //not proper way since the class name changes according to the production and developement.

//Way 3
cy.get("[data-testid = (name_of_button)]"); //() -> represents varriable    //Best way

//assert or match if url is correct
cy.url().should("include", "/(url_name)");
