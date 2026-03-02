import {
  cloneDeep,
  findIndex,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Icon,
  IconButton,
  Row,
  Selection,
} from '@folio/stripes/components';

import {
  notRequired,
  required,
} from '../../../util/validate';
import css from './SelectReportType.css';

const omitUsedOptions = (list, usedValues, id) => {
  const unUsedValues = cloneDeep(list);

  if (!isEmpty(usedValues)) {
    usedValues.forEach((item, index) => {
      if (id !== index) {
        const usedValueIndex = findIndex(unUsedValues, (v) => {
          return v.label === item;
        });

        if (usedValueIndex !== -1) {
          unUsedValues.splice(usedValueIndex, 1);
        }
      }
    });
  }

  return unUsedValues;
};

function SelectReportType(props) {
  const { counterReportsCurrentVersion, fields, selectedReports } = props;

  return (
    <Row>
      <Col xs={12}>
        {fields.map((elem, index) => (
          <Row key={index}>
            <Col xs={6}>
              <div id={`reportType-selection-${index}`}>
                <Field
                  component={Selection}
                  data={props.required ? 1 : 0}
                  dataOptions={omitUsedOptions(
                    counterReportsCurrentVersion,
                    selectedReports,
                    index
                  )}
                  label={
                    <FormattedMessage id="ui-erm-usage.reportOverview.reportType" />
                  }
                  name={elem}
                  validate={props.required ? required : notRequired}
                />
              </div>
            </Col>
            <Col xs={2}>
              <div className={`${css.repeatableFieldRemoveItem}`}>
                <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.deleteThisItem">
                  {([label]) => (
                    <IconButton
                      aria-label={label}
                      icon="trash"
                      onClick={() => fields.remove(index)}
                    />
                  )}
                </FormattedMessage>
              </div>
            </Col>
          </Row>
        ))}
      </Col>
      <Col xs={4}>
        <Button data-test-add-report-button onClick={() => fields.push('')}>
          <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.addReportType">
            {([label]) => <Icon icon="plus-sign">{label}</Icon>}
          </FormattedMessage>
        </Button>
      </Col>
    </Row>
  );
}

SelectReportType.propTypes = {
  counterReportsCurrentVersion: PropTypes.arrayOf(PropTypes.shape()),
  fields: PropTypes.object,
  required: PropTypes.bool,
  selectedReports: PropTypes.arrayOf(PropTypes.string),
};

export default SelectReportType;
