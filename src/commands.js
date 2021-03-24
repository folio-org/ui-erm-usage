import React from 'react';
import { FormattedMessage } from 'react-intl';

const commands = [
  {
    name: 'new',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.createRecord" />),
    shortcut: 'alt+n',
  },
  {
    name: 'edit',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.editRecord" />),
    shortcut: 'mod+alt+e',
  },
  {
    name: 'save',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.saveRecord" />),
    shortcut: 'mod+s',
  },
  {
    name: 'expandAllSections',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.expandAll" />),
    shortcut: 'mod+alt+b'
  },
  {
    name: 'collapseAllSections',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.collapseAll" />),
    shortcut: 'mod+alt+g'
  },
  {
    name: 'search',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.goToSearchFilter" />),
    shortcut: 'mod+alt+h',
  },
  {
    name: 'openShortcutModal',
    label: (<FormattedMessage id="ui-erm-usage.shortcut.openShortcutModal" />),
    shortcut: 'mod+shift+7',
  }
];

export default commands;
