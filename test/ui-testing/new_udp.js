module.exports.test = function uiTest(uiTestCtx) {
  describe('Module test: ui-erm-usage:new_udp', function testDescribe() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    const label = '__000Test UDP 1';
    const vendorId = 'f8b7e8ea-3afb-446d-9ec9-7a6c69d104ae';
    const platformId = '4a9c5aa2-2acc-46fc-9e0c-bc8598cff6b1';
    const harvestingStatus = 'active';
    const serviceType = 'COUNTER-SUSHI4';
    const serviceUrl = 'www.testService.com';
    const reportRelease = '5';
    const requestedReport0 = 'DR';
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
          .wait('select[name="requestedReports[0]"]')
          .select('select[name="requestedReports[0]"]', requestedReport0)
          .insert('input[name=customerId]', customerId)
          .insert('input[name=requestorId]', requestorId)
          .insert('input[name=harvestingStart]', harvestingStart)
          .click('#clickable-createnewudp')
          .wait('#clickable-newusageDataProvider')
          .then(() => { done(); })
          .catch(done);
      });
      it('should find new udp in list ', (done) => {
        nightmare
          // .wait('#list-erm-usage')
          // .url()
          .wait('input[name=input-usageDataProvider-search]')
          .insert('input[name=input-usageDataProvider-search]', label)
          // .check('input[id=clickable-filter-harvestingStatus-Active]')
          // .wait(1000)
          // .click('#clickable-list-column-name')
          .wait(100)
          .evaluate((udpLabel) => {
            const sel = `#list-erm-usage div[role="listitem"]:nth-child(1) > a > div[title="${udpLabel}"]`;
            const selUdp = document.querySelector(sel);
            if (selUdp === null) {
              throw new Error(`Can't find newly created udp (${udpLabel}) at top of sorted list with selector: ${sel}`);
            }
          }, label)
          .then(() => { done(); })
          .catch(done);
      });

      // TODO: Delete udp
    });
  });
};