import {
  isEmpty,
  sortBy,
} from 'lodash';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  Col,
  Select,
  TextField,
} from '@folio/stripes/components';

import {
  notRequired,
  required,
} from '../../../util/validate';

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
          component={Select}
          data={!disabled && isRequired ? 1 : 0}
          dataOptions={aggOptions}
          disabled={disabled}
          fullWidth
          id="addudp_aggid"
          label={
            <FormattedMessage id="ui-erm-usage.information.aggregator" />
          }
          name="harvestingConfig.aggregator.id"
          placeholder={intl.formatMessage({
            id: 'ui-erm-usage.udp.form.placeholder.aggregator.select',
          })}
          required={!disabled && isRequired}
          validate={!disabled && isRequired ? required : notRequired}
        />
      </Col>
      <Col xs={4}>
        <Field
          component={TextField}
          disabled={disabled}
          fullWidth
          id="addudp_vendorcode"
          label={
            <FormattedMessage id="ui-erm-usage.udp.form.harvestingConfig.vendorCode" />
          }
          name="harvestingConfig.aggregator.vendorCode"
          placeholder={intl.formatMessage({
            id: 'ui-erm-usage.udp.form.placeholder.aggregator.vendor',
          })}
        />
      </Col>
    </>
  );
};

AggregatorInfoForm.propTypes = {
  aggregators: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  intl: PropTypes.object,
  isRequired: PropTypes.bool,
};

export default injectIntl(AggregatorInfoForm);
