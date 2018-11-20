module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: ui-erm-usage:new_udp', function testDescribe() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const label = '__000Test UDP 1' + Math.random();
    const vendorId = 'c446712d-fcb4-4954-92c5-57dc1a96ded3';
    const platformId = '4a9c5aa2-2acc-46fc-9e0c-bc8598cff6b1';
    const harvestingStatus = 'active';
    const serviceType = 'cs41';
    const serviceUrl = 'www.testService.com';
    const reportRelease = 4;
    const requestedReport0 = 'JR1';
    const customerId = 'testCustomerId';
    const requestorId = 'testRequestorId';
    const harvestingStart = '2018-01';

    describe('Login > Open module "ERM-Usage" > Create new usage data provider > Sort list by label > Confirm creation of new udp > Logout', () => {
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
          .insert('input[name=vendorId]', vendorId)
          .click('#clickable-find-vendor-by-id')
          .wait('div[name=vendorName]')
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
          .wait('#clickable-delete-udp')
          .click('#clickable-delete-udp')
          .then(() => { done(); })
          .catch(done);
      });
      // TODO: Delete udp
      // it('should delete udp', (done) => {
      //   nightmare
      //     .wait('#clickable-delete-udp')
      //     .wait(10000)
      //     // .click('#clickable-delete-udp')
      //     .wait(1000)
      //     // .wait('#list-erm-usage')
      //     // .check('#clickable-filter-harvestingStatus-Active')
      //     // .insert('#input-usageDataProvider-search', label)
      //     // .click('[data-test-search-and-sort-submit]')
      //     // .wait(1000)
      //     // .evaluate((name) => {
      //     //   const node = Array.from(
      //     //     document.querySelectorAll('#list-erm-usage div[role="listitem"]:nth-child(1) > a > div')
      //     //   ).find(e => e.textContent === name);
      //     //   if (node) {
      //     //     throw new Error(`UDP ${name} was not deleted`);
      //     //   }
      //     // }, label)
      //     .then(() => { done(); })
      //     .catch(done);
      // });
    });
  });
};