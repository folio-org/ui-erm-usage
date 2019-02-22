module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: ui-erm-usage:new_udp', function testDescribe() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const label = '__000Test UDP 1' + Math.random();
    const changedLabel = label + '_CHANGED';
    const platformId = '4a9c5aa2-2acc-46fc-9e0c-bc8598cff6b1';
    const harvestingStatus = 'active';
    const harvestingVia = 'sushi';
    const serviceType = 'cs41';
    const serviceUrl = 'www.testService.com';
    const reportRelease = 4;
    const requestedReport0 = 'JR1';
    const customerId = 'testCustomerId';
    const requestorId = 'testRequestorId';
    const harvestingStart = '2018-01';

    describe('Login > Open module "ERM-Usage > Create new usage data provider > Sort list by label > Confirm creation of new udp > Change udp > Delete udp > Logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open module "ERM Usage" and find version tag', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'erm-usage', testVersion))
          .then(result => result);
      });
      it('should create new udp', (done) => {
        nightmare
          .wait('#clickable-newusageDataProvider')
          .click('#clickable-newusageDataProvider')
          .wait(55)
          .insert('input[name=label]', label)

          // Select the first vendor in plugin-find-vendor
          .click('#clickable-plugin-find-vendor')
          .wait(3000)
          .wait('#list-vendors')
          .click('div[role="row"] a')
          .wait(500)

          .insert('input[name="platform.id"]', platformId)
          .select('select[name="harvestingConfig.harvestingStatus"]', harvestingStatus)
          .select('select[name="harvestingConfig.harvestVia"]', harvestingVia)
          .select('select[name="harvestingConfig.sushiConfig.serviceType"]', serviceType)
          .insert('input[name="harvestingConfig.sushiConfig.serviceUrl"]', serviceUrl)
          .select('select[name="harvestingConfig.reportRelease"]', reportRelease)
          .click('#clickable-add-report')
          .wait('div[name=add-report-list]')
          .click(`#add-report-${requestedReport0}`)
          .wait(55)
          .insert('input[name="harvestingConfig.harvestingStart"]', harvestingStart)
          .insert('input[name="sushiCredentials.customerId"]', customerId)
          .insert('input[name="sushiCredentials.requestorId"]', requestorId)
          .click('#clickable-createnewudp')
          .wait('#clickable-newusageDataProvider')
          .then(() => { done(); })
          .catch(done);
      });
      it('should find new udp in list ', (done) => {
        nightmare
          .wait('#list-erm-usage')
          .wait(500)
          .wait('#input-usageDataProvider-search', 1000)
          .insert('#input-usageDataProvider-search', label)
          .wait('button[type=submit]')
          .click('button[type=submit]')
          .wait('#list-erm-usage[data-total-count="1"]')
          .wait(500)
          // .wait('#list-erm-usage')
          .evaluate((name) => {
            const node = Array.from(
              document.querySelectorAll('#list-erm-usage div[role="row"][aria-rowindex="2"] > a > div')
            ).find(e => e.textContent === name);
            if (!node) {
              throw new Error(`Can't find newly created udp (${name}) at top of sorted list.`);
            }
          }, label)
          .then(() => { done(); })
          .catch(done);
      });
      it('should change udp', (done) => {
        nightmare
          .wait('#clickable-edit-udp')
          .click('#clickable-edit-udp')
          .wait('input[name=label]')
          .insert('input[name=label]', '')
          .insert('input[name=label]', changedLabel)

          .click('#clickable-createnewudp')
          .wait('#clickable-newusageDataProvider')
          .then(() => { done(); })
          .catch(done);
      });
      it('should delete udp', (done) => {
        nightmare
          .wait('#clickable-delete-udp')
          .click('#clickable-delete-udp')
          .wait(1000)
          .evaluate((name) => {
            const node = Array.from(
              document.querySelectorAll('#list-erm-usage div[role="row"][aria-rowindex="2"] > a > div')
            ).find(e => e.textContent === name);
            if (node) {
              throw new Error(`Can find udp ${name} at top of sorted list, thus delete was not successful.`);
            }
          }, changedLabel)
          .then(() => { done(); })
          .catch(done);
      });
    });
  });
};
