import { times } from 'lodash';
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

// Show the stored reportType even if it's unsupported
// New rows only get supported reports
// Reports used in other rows are filtered out
const getReportTypeOptions = (supported, selected, index) => {
  const reports = selected ?? [];
  const current = reports[index];
  const usedElsewhere = new Set(reports.filter((_, i) => i !== index));
  const options = supported.filter(o => !usedElsewhere.has(o.value));

  return current && !options.some(o => o.value === current)
    ? [...options, { label: current, value: current }]
    : options;
};

function SelectReportType(props) {
  const { counterReportsCurrentVersion, disabled, fields, selectedReports } = props;

  const placeholderRowName = `${fields.name}[0]`;
  const isPlaceholderRowShown = props.required && fields.length === 0;
  const rowNames = isPlaceholderRowShown ? [placeholderRowName] : fields.map(name => name);
  const canRemoveRows = !props.required || fields.length > 1;

  const addReportType = () => {
    const entriesToAdd = isPlaceholderRowShown ? 2 : 1;
    times(entriesToAdd, () => fields.push(''));
  };

  return (
    <>
      <Row>
        <Col xs={7}>
          {rowNames.map((name, index) => (
            <Row key={name}>
              <Col xs={6}>
                <div id={`reportType-selection-${index}`}>
                  <Field
                    component={Selection}
                    data={props.required ? 1 : 0}
                    dataOptions={getReportTypeOptions(
                      counterReportsCurrentVersion,
                      selectedReports,
                      index
                    )}
                    disabled={disabled}
                    label={<FormattedMessage id="ui-erm-usage.reportOverview.reportType" />}
                    name={name}
                    validate={props.required ? required : notRequired}
                  />
                </div>
              </Col>
              <Col xs={1}>
                {canRemoveRows && (
                  <div className={`${css.repeatableFieldRemoveItem}`}>
                    <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.deleteThisItem">
                      {([label]) => (
                        <IconButton
                          aria-label={label}
                          disabled={disabled}
                          icon="trash"
                          onClick={() => fields.remove(index)}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                )}
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Button
            disabled={disabled}
            onClick={addReportType}
          >
            <FormattedMessage id="ui-erm-usage.udpHarvestingConfig.addReportType">
              {([label]) => <Icon icon="plus-sign">{label}</Icon>}
            </FormattedMessage>
          </Button>
        </Col>
      </Row>
    </>
  );
}

SelectReportType.propTypes = {
  counterReportsCurrentVersion: PropTypes.arrayOf(PropTypes.shape()),
  disabled: PropTypes.bool,
  fields: PropTypes.object,
  required: PropTypes.bool,
  selectedReports: PropTypes.arrayOf(PropTypes.string),
};

export default SelectReportType;
