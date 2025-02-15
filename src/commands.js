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
  },
  {
    name: 'openShortcutModal',
    label: (<FormattedMessage id="stripes-components.shortcut.openShortcutModal" />),
    shortcut: 'mod+alt+k',
  },
  {
    name: 'expandCollapse',
    label: (<FormattedMessage id="stripes-components.shortcut.expandOrCollapse" />),
    shortcut: 'spacebar'
  },
];

export default commands;
