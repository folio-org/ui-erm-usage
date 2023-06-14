import React, { useMemo } from 'react';
import { useStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';
import { Col, Row, TextField } from '@folio/stripes/components';
import { Field } from 'redux-form';
import { DAYS_TO_KEEP_LOGS } from '../../util/constants';

const HarvesterLogsSettings = () => {
  const stripes = useStripes();
  const ConfigManagerConnected = useMemo(() => stripes.connect(ConfigManager), [stripes]);

  const getInitialValues = (settings) => {
    const value = (settings?.length && settings[0].value) || DAYS_TO_KEEP_LOGS;
    return { daysToKeepLogs: value };
  };

  return (
    <ConfigManagerConnected
      getInitialValues={getInitialValues}
      label={
        <FormattedMessage id="ui-erm-usage.settings.harvester.logs.title" />
      }
      moduleName="ERM-USAGE-HARVESTER"
      configName="daysToKeepLogs"
    >
      <div>
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              type="number"
              id="daysToKeepLogs"
              name="daysToKeepLogs"
              label={
                <FormattedMessage id="ui-erm-usage.settings.harvester.logs.daysToKeepLogs" />
              }
            />
          </Col>
        </Row>
      </div>
    </ConfigManagerConnected>
  );
};

export default HarvesterLogsSettings;
