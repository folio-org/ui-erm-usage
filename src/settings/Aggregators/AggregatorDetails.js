import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import DownloadCredentialsButton from './DownloadCredentialsButton';
import { AggregatorConfigView } from './AggregatorConfig';

import aggregatorAccountConfigTypes from '../../util/data/aggregatorAccountConfigTypes';

const AggregatorDetails = ({
  initialValues,
  resources,
  stripes,
  aggregators,
}) => {
  const [sections, setSections] = useState({
    generalInformation: true,
    aggregatorConfig: true,
    accountConfig: true,
  });

  const handleSectionToggle = ({ id }) => {
    setSections((curState) => ({
      ...curState,
      [id]: !curState[id]
    }));
  };

  const handleExpandAll = (secs) => {
    setSections(secs);
  };

  const renderContact = (aggregator) => {
    if (aggregator.accountConfig && aggregator.accountConfig.displayContact) {
      return aggregator.accountConfig.displayContact.map((item, i) => (
        <p key={i}>{item}</p>
      ));
    } else {
      return null;
    }
  };

  const aggregator = initialValues;
  const contacts = renderContact(aggregator);
  const sType = aggregator.serviceType;
  const serviceType = aggregators.find((e) => e.value === sType);
  const serviceTypeLabel = serviceType?.label ?? <NoValue />;

  const currentConfTypeValue = get(
    aggregator,
    'accountConfig.configType',
    ''
  );
  const configType = aggregatorAccountConfigTypes.find(
    (e) => e.value === currentConfTypeValue
  );
  const configTypeLabel = configType.label ?? <NoValue />;

  const settings = resources?.settings?.records || [];
  const hideValues = !isEmpty(settings) && settings[0].value === 'true';

  const config = aggregator.aggregatorConfig;

  const displayWhenOpenAccountConfAcc = (
    <DownloadCredentialsButton
      aggregatorId={aggregator.id}
      stripes={stripes}
    />
  );

  return (
    <div data-test-aggregator-details>
      <AccordionSet>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton
              accordionStatus={sections}
              onToggle={handleExpandAll}
            />
          </Col>
        </Row>
        <Accordion
          open={sections.generalInformation}
          id="generalInformation"
          onToggle={handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.generalInformation" />}
        >
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.aggregator.name" />}
                value={aggregator.label}
              />
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.aggregator.serviceType" />}
                value={serviceTypeLabel}
              />
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.aggregator.serviceUrl" />}
                value={aggregator.serviceUrl}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={sections.aggregatorConfig}
          id="aggregatorConfig"
          onToggle={handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.aggregatorConfig.title" />}
        >
          <Row>
            <Col xs={8}>
              <AggregatorConfigView
                aggregatorConfig={config}
                hideValues={hideValues}
              />
            </Col>
          </Row>
        </Accordion>

        <Accordion
          open={sections.accountConfig}
          id="accountConfig"
          onToggle={handleSectionToggle}
          label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig" />}
          displayWhenOpen={displayWhenOpenAccountConfAcc}
        >
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.type" />}
                value={configTypeLabel}
              />
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.mail" />}
                value={aggregator.accountConfig.configMail}
              />
              <KeyValue
                label={<FormattedMessage id="ui-erm-usage.aggregator.config.accountConfig.contact" />}
                value={contacts}
              />
            </Col>
          </Row>
        </Accordion>
      </AccordionSet>
    </div>
  );
};

AggregatorDetails.manifest = Object.freeze({
  settings: {
    type: 'okapi',
    records: 'configs',
    path: 'configurations/entries?query=(module==ERM-USAGE and configName==hide_credentials)',
  },
});

AggregatorDetails.propTypes = {
  initialValues: PropTypes.object,
  resources: PropTypes.shape({
    settings: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  stripes: PropTypes.shape().isRequired,
  aggregators: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default stripesConnect(AggregatorDetails);
