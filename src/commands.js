import { FormattedMessage } from 'react-intl';

const commands = [
  {
    name: 'new',
    label: (<FormattedMessage id="stripes-components.shortcut.createRecord" />),
    shortcut: 'alt+n'
  },
  {
    name: 'edit',
    label: (<FormattedMessage id="stripes-components.shortcut.editRecord" />),
    shortcut: 'mod+alt+e'
  },
  {
    name: 'save',
    label: (<FormattedMessage id="stripes-components.shortcut.saveRecord" />),
    shortcut: 'mod+s'
  },
  {
    name: 'expandAllSections',
    label: (<FormattedMessage id="stripes-components.shortcut.expandAll" />),
    shortcut: 'mod+alt+b'
  },
  {
    name: 'collapseAllSections',
    label: (<FormattedMessage id="stripes-components.shortcut.collapseAll" />),
    shortcut: 'mod+alt+g'
  },
  {
    name: 'search',
    label: (<FormattedMessage id="stripes-components.shortcut.goToSearchFilter" />),
    shortcut: 'mod+alt+h'
  }
];

export default commands;
