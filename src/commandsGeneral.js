import { FormattedMessage } from 'react-intl';

const commandsGeneral = [
  {
    name: 'expandCollapse',
    label: (<FormattedMessage id="stripes-components.shortcut.expandOrCollapse" />),
    shortcut: 'spacebar'
  },
  {
    name: 'close',
    label: (<FormattedMessage id="stripes-components.shortcut.closeModal" />),
    shortcut: 'esc'
  },
  {
    name: 'copy',
    label: (<FormattedMessage id="stripes-components.shortcut.copy" />),
    shortcut: 'mod+c'
  },
  {
    name: 'cut',
    label: (<FormattedMessage id="stripes-components.shortcut.cut" />),
    shortcut: 'mod+x'
  },
  {
    name: 'paste',
    label: (<FormattedMessage id="stripes-components.shortcut.paste" />),
    shortcut: 'mod+v'
  },
  {
    name: 'find',
    label: (<FormattedMessage id="stripes-components.shortcut.find" />),
    shortcut: 'mod+f'
  }
];

export default commandsGeneral;
