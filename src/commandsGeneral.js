import React from 'react';
import { FormattedMessage } from 'react-intl';

const commandsGeneral = [
  {
    label: (<FormattedMessage id="ui-erm-usage.shortcut.expandCollapse" />),
    shortcut: 'spacebar'
  },
  {
    name: 'close',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.closeModal" />),
    shortcut: 'esc'
  },
  {
    label: (<FormattedMessage id="ui-erm-usage.shortcut.copy" />),
    shortcut: 'mod+c'
  },
  {
    label: (<FormattedMessage id="ui-erm-usage.shortcut.cut" />),
    shortcut: 'mod+x'
  },
  {
    label: (<FormattedMessage id="ui-erm-usage.shortcut.paste" />),
    shortcut: 'mod+v'
  },
  {
    label: (<FormattedMessage id="ui-erm-usage.shortcut.find" />),
    shortcut: 'mod+f'
  }
];

export default commandsGeneral;
