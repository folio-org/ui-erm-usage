import PropTypes from 'prop-types';
import { isEmpty, sortBy } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { Col, Select, TextField } from '@folio/stripes/components';

import { notRequired, required } from '../../../util/validate';

const AggregatorInfoForm = ({
  aggregators,
  disabled,
  intl,
  isRequired,
}) => {
  const extractAggregatorSelectOptions = (items) => {
    if (isEmpty(items)) {
      return [];
    }

    const aggs = items.map((a) => {
      return { value: a.id, label: a.label };
    });
    return sortBy(aggs, ['label', 'value']);
  };

  const records = aggregators;
  const aggs = records && records.length ? records[0].aggregatorSettings : {};
  const aggOptions = extractAggregatorSelectOptions(aggs);

  return (
    <>
      <Col xs={4}>
        <Field
          label={
            <FormattedMessage id="ui-erm-usage.information.aggregator" />
          }
          name="harvestingConfig.aggregator.id"
          id="addudp_aggid"
          placeholder={intl.formatMessage({
            id: 'ui-erm-usage.udp.form.placeholder.aggregator.select',
          })}
          component={Select}
          dataOptions={aggOptions}
          disabled={disabled}
          required={!disabled && isRequired}
          validate={!disabled && isRequired ? required : notRequired}
          data={!disabled && isRequired ? 1 : 0}
          fullWidth
        />
      </Col>
      <Col xs={4}>
        <Field
          label={
            <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.vendorCode" />
          }
          name="harvestingConfig.aggregator.vendorCode"
          id="addudp_vendorcode"
          placeholder={intl.formatMessage({
            id: 'ui-erm-usage.udp.form.placeholder.aggregator.vendor',
          })}
          component={TextField}
          disabled={disabled}
          fullWidth
        />
      </Col>
    </>
  );
};

AggregatorInfoForm.propTypes = {
  aggregators: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  intl: PropTypes.object,
  isRequired: PropTypes.bool
};

export default injectIntl(AggregatorInfoForm);
