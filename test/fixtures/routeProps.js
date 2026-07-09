import stubUDP from './udp';

const routeProps = {
  history: { push: jest.fn() },
  location: {
    pathname: '/eusage/view/test',
    search: '',
  },
  match: { params: { id: stubUDP.id } },
  mutator: {
    usageDataProvider: {
      DELETE: jest.fn().mockResolvedValue(),
    },
  },
  resources: {
    tagSettings: { records: [] },
    usageDataProvider: { records: [stubUDP], isPending: false },
  },
};

export default routeProps;
