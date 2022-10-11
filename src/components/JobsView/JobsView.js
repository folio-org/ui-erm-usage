import PropTypes from 'prop-types';
import {
  Button,
  MultiColumnList,
  Pane,
  PaneMenu,
  Paneset,
} from '@folio/stripes-components';
import {
  SearchAndSortQuery
} from '@folio/stripes-smart-components';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { useStripes } from '@folio/stripes/core';
import { useHistory, useLocation } from 'react-router';
import { useState } from 'react';
import urls from '../../util/urls';

const JobsView = ({ source }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();
  const location = useLocation();
  const history = useHistory();
  const [fromPath] = useState(() => (location.state?.from ? location.state.from : urls.udps()));

  const querySetter = ({ nsValues }) => {
    source.mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return get(source.resources, 'query', {});
  };

  const renderResultsPaneSubtitle = () => {
    if (source && source.loaded()) {
      const count = source.totalCount();
      return (
        <FormattedMessage
          id="stripes-smart-components.searchResultsCountHeader"
          values={{ count }}
        />
      );
    }
    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  const getLocaleDate = (date) => {
    return date
      ? new Date(date).toLocaleString(stripes.locale, {
        timeZone: stripes.timezone,
      })
      : '';
  };

  const format = (number) => number.toLocaleString(stripes.locale, {
    minimumIntegerDigits: 1,
    maximumFractionDigits: 0,
  });

  const getDuration = (start, finish) => {
    if (start && finish) {
      const diff =
        (new Date(finish).getTime() - new Date(start).getTime()) / 1000;
      const hours = diff / 3600;
      const minutes = (diff % 3600) / 60;
      const seconds = diff % 60;

      let result = '';
      if (hours >= 1) {
        result += format(hours) + 'h ';
      }
      result += format(minutes) + 'm ' + format(seconds) + 's';
      return result;
    } else {
      return '';
    }
  };

  const sortParam = source.resources.query.sort || '';
  const sortDirection = sortParam.startsWith('-') ? 'descending' : 'ascending';
  const sortOrder = sortParam.replace(/^-/, '').replace(/,.*/, '');

  return (
    <SearchAndSortQuery
      initialFilterState={{ filters: [] }}
      initialSearchState={{ query: '' }}
      initialSortState={{ sort: '-startedAt' }}
      queryGetter={queryGetter}
      querySetter={querySetter}
      syncToLocationSearch
    >
      {(renderProps) => (
        <Paneset>
          <Pane
            defaultWidth="fill"
            padContent={false}
            paneTitle={formatMessage({ id: 'ui-erm-usage.harvester.jobs.paneTitle' })}
            paneSub={renderResultsPaneSubtitle()}
            lastMenu={
              <PaneMenu>
                <Button
                  buttonStyle="primary"
                  marginBottom0
                  onClick={() => {
                    source.mutator.timestamp.replace(Date.now());
                  }}
                >
                  {formatMessage({ id: 'ui-erm-usage.harvester.jobs.refresh' })}
                </Button>
              </PaneMenu>
            }
            dismissible
            onClose={() => history.push(fromPath)}
          >
            <MultiColumnList
              autoSize
              virtualize
              loading={source.pending()}
              visibleColumns={[
                'providerId',
                'type',
                'startedAt',
                'finishedAt',
                'duration',
              ]}
              formatter={{
                providerId: (job) => {
                  if (job.providerId) {
                    const result = source.resources.udps.records.find(
                      (i) => i.id === job.providerId
                    );
                    return result ? result.label : job.providerId;
                  } else {
                    return stripes.okapi.tenant;
                  }
                },
                type: (job) => formatMessage({ id: 'ui-erm-usage.harvester.jobs.filter.type.' + job.type }),
                startedAt: (job) => (job.nextStart
                  ? getLocaleDate(job.nextStart)
                  : getLocaleDate(job.startedAt)),
                finishedAt: (job) => getLocaleDate(job.finishedAt),
                duration: (job) => getDuration(job.startedAt, job.finishedAt),
              }}
              contentData={source.records() || []}
              columnMapping={{
                providerId: formatMessage({ id: 'ui-erm-usage.harvester.jobs.column.provider' }),
                type: formatMessage({ id: 'ui-erm-usage.harvester.jobs.column.type' }),
                startedAt: formatMessage({ id: 'ui-erm-usage.harvester.jobs.column.start' }),
                finishedAt: formatMessage({ id: 'ui-erm-usage.harvester.jobs.column.finish' }),
                duration: formatMessage({ id: 'ui-erm-usage.harvester.jobs.column.duration' }),
              }}
              totalCount={source.totalCount() || 0}
              onNeedMoreData={() => {
                source.fetchMore(30);
              }}
              onHeaderClick={(e, m) => {
                return ['startedAt', 'finishedAt'].includes(m.name)
                  ? renderProps.onSort(e, m)
                  : {};
              }}
              sortDirection={sortDirection}
              sortOrder={sortOrder}
            />
          </Pane>
        </Paneset>
      )}
    </SearchAndSortQuery>
  );
};

JobsView.propTypes = {
  source: PropTypes.object,
};

export default JobsView;
