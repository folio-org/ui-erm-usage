import { useMemo } from 'react';
import { useStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';
import { Col, Row, TextField } from '@folio/stripes/components';
import { Field } from 'react-final-form';

import {
  DAYS_TO_KEEP_LOGS,
  MOD_SETTINGS
} from '../../util/constants';

const { CONFIG_NAMES, SCOPES } = MOD_SETTINGS;

const HarvesterLogsSettings = () => {
  const stripes = useStripes();
  const ConfigManagerConnected = useMemo(() => stripes.connect(ConfigManager), [stripes]);

  const getInitialValues = (settings) => ({
    [CONFIG_NAMES.DAYS_TO_KEEP_LOGS]: settings[0]?.value || DAYS_TO_KEEP_LOGS,
  });

  return (
    <ConfigManagerConnected
      configName={CONFIG_NAMES.DAYS_TO_KEEP_LOGS}
      formType="final-form"
      getInitialValues={getInitialValues}
      label={<FormattedMessage id="ui-erm-usage.settings.harvester.logs.title" />}
      scope={SCOPES.HARVESTER}
    >
      <div>
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              id={CONFIG_NAMES.DAYS_TO_KEEP_LOGS}
              label={<FormattedMessage id="ui-erm-usage.settings.harvester.logs.daysToKeepLogs" />}
              name={CONFIG_NAMES.DAYS_TO_KEEP_LOGS}
              type="number"
            />
          </Col>
        </Row>
      </div>
    </ConfigManagerConnected>
  );
};

export default HarvesterLogsSettings;
