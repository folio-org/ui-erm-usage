import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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

import css from './SelectReportType.css';

const omitUsedOptions = (list, usedValues, id) => {
  const unUsedValues = _.cloneDeep(list);
  if (!_.isEmpty(usedValues)) {
    usedValues.forEach((item, index) => {
      if (id !== index) {
        const usedValueIndex = _.findIndex(unUsedValues, (v) => {
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
              <Field
                component={Selection}
                dataOptions={omitUsedOptions(
                  counterReportsCurrentVersion,
                  selectedReports,
                  index
                )}
                label="Report type"
                name={elem}
              />
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
        <Button onClick={() => fields.push('')}>
          <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.addReportType">
            {([label]) => <Icon icon="plus-sign">{label}</Icon>}
          </FormattedMessage>
        </Button>
      </Col>
    </Row>
  );
}

SelectReportType.propTypes = {
  fields: PropTypes.object,
  counterReportsCurrentVersion: PropTypes.arrayOf(PropTypes.shape()),
  selectedReports: PropTypes.arrayOf(PropTypes.string),
};

export default SelectReportType;
