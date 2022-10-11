const urls = {
  udps : () => '/eusage',
  udpView: id => `/eusage/view/${id}`,
  udpEdit: id => `/eusage/${id}/edit`,
  udpCreate: () => '/eusage/create',

  jobsView: '/eusage/jobs',

  notes: () => '/eusage/notes',
  noteView: id => `/eusage/notes/${id}`,
  noteEdit: id => `/eusage/notes/${id}/edit`,
  noteCreate: () => '/eusage/notes/create',
};

export default urls;
