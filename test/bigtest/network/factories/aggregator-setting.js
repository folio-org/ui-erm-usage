import Factory from './application';

export default Factory.extend({
  label: (i) => 'label_' + i,
  serviceType: () => 'NSS',
  serviceUrl: (i) => 'www.myaggregator_' + i + '.com',
  accountConfig: (i) => ({
    configType: 'Manual',
    configMail: 'configMail' + i + '@mail.de'
  })
});
