module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: ui-erm-usage:new_udp', function testDescribe() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const label = '__000Test UDP 1' + Math.random();
    const changedLabel = label + '_CHANGED';
    const platformId = '4a9c5aa2-2acc-46fc-9e0c-bc8598cff6b1';
    const harvestingStatus = 'active';
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
          .click('#accordion-toggle-button-editHarvestingConfig')
          .wait(25)
          .insert('input[name=label]', label)

          // Select the first vendor in plugin-find-vendor
          .click('#clickable-plugin-find-vendor')
          .wait(3000)
          .wait('#list-vendors')
          .click('div[role="listitem"] a')
          .wait(500)

          .insert('input[name=platformId]', platformId)
          .select('select[name=harvestingStatus]', harvestingStatus)
          .uncheck('input[name=useAggregator]')
          .select('select[name=serviceType]', serviceType)
          .insert('input[name=serviceUrl]', serviceUrl)
          .select('select[name=reportRelease]', reportRelease)
          .click('#clickable-add-report')
          .wait('div[name=add-report-list]')
          .click(`#add-report-${requestedReport0}`)
          .wait(55)
          .insert('input[name=harvestingStart]', harvestingStart)
          .insert('input[name=customerId]', customerId)
          .insert('input[name=requestorId]', requestorId)
          .click('#clickable-createnewudp')
          .wait('#clickable-newusageDataProvider')
          .then(() => { done(); })
          .catch(done);
      });
      it('should find new udp in list ', (done) => {
        nightmare
          .wait('#list-erm-usage')
          .check('#clickable-filter-harvestingStatus-Active')
          .insert('#input-usageDataProvider-search', label)
          .click('[data-test-search-and-sort-submit]')
          .wait(1000)
          .evaluate((name) => {
            const node = Array.from(
              document.querySelectorAll('#list-erm-usage div[role="listitem"]:nth-child(1) > a > div')
            ).find(e => e.textContent === name);
            if (!node) {
              throw new Error(`Can't find newly created udp (${name}) at top of sorted list`);
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
      it('should find changed udp', (done) => {
        nightmare
          .wait('#udpInfo')
          .insert('#input-usageDataProvider-search', '')
          .insert('#input-usageDataProvider-search', changedLabel)
          .click('[data-test-search-and-sort-submit]')
          .wait(5000)
          .evaluate((name) => {
            const node = Array.from(
              document.querySelectorAll('#list-erm-usage div[role="listitem"]:nth-child(1) > a > div')
            ).find(e => e.textContent === name);
            if (!node) {
              throw new Error(`Can't find newly created udp (${name}) at top of sorted list`);
            }
          }, changedLabel)
          .then(done)
          .catch(done);
      });
      it('should delete udp', (done) => {
        nightmare
          .wait('#clickable-delete-udp')
          .click('#clickable-delete-udp')
          .wait(1000)
          .evaluate((name) => {
            const node = Array.from(
              document.querySelectorAll('#list-erm-usage div[role="listitem"]:nth-child(1) > a > div')
            ).find(e => e.textContent === name);
            if (node) {
              throw new Error(`Can find udp ${name} at top of sorted list, thus delete was not successful`);
            }
          }, changedLabel)
          .then(() => { done(); })
          .catch(done);
      });
    });
  });
};
