const urls = {
  eUsage: () => '/eusage',

  notes: () => '/eusage/notes',
  noteView: id => `/eusage/notes/${id}`,
  noteEdit: id => `/eusage/notes/${id}/edit`,
  noteCreate: () => '/eusage/notes/create',
};

export default urls;
