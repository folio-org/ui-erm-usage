const urls = {
  udps : () => '/eusage/udps',
  udpView: id => `/eusage/udps/${id}`,
  udpEdit: id => `/eusage/udps/${id}/edit`,
  udpCreate: () => '/eusage/udps/create',

  notes: () => '/eusage/notes',
  noteView: id => `/eusage/notes/${id}`,
  noteEdit: id => `/eusage/notes/${id}/edit`,
  noteCreate: () => '/eusage/notes/create',
};

export default urls;
