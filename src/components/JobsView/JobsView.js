import PropTypes from 'prop-types';
import {
  Button,
  MultiColumnList,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';
import { SearchAndSortQuery, buildUrl } from '@folio/stripes/smart-components';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { useStripes } from '@folio/stripes/core';
import { useHistory, useLocation } from 'react-router';
import JobsFilter from './JobsFilter';
import urls from '../../util/urls';
import JobsViewResultCell from './JobsViewResultCell';

const resultsFormatter = (formatMessage, stripes, source) => {
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

  return {
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
    type: (job) => formatMessage({
      id: 'ui-erm-usage.harvester.jobs.filter.type.' + job.type,
    }),
    startedAt: (job) => (job.nextStart
      ? getLocaleDate(job.nextStart)
      : getLocaleDate(job.startedAt)),
    finishedAt: (job) => getLocaleDate(job.finishedAt),
    duration: (job) => getDuration(job.startedAt, job.finishedAt),
    status: (job) => {
      let status;
      if (job.finishedAt) {
        status = 'finished';
      } else {
        status = job.nextStart ? 'scheduled' : 'running';
      }
      return formatMessage({
        id: 'ui-erm-usage.harvester.jobs.filter.status.' + status,
      });
    },
    result: (job) => (job.result ? (
      <JobsViewResultCell
        errorMessage={job.errorMessage}
        text={formatMessage({
          id: 'ui-erm-usage.harvester.jobs.filter.result.' + job.result,
        })}
      />
    ) : (
      ''
    )),
  };
};

const JobsView = ({ source, filterGroups }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();
  const history = useHistory();
  const fromPath = get(useLocation().state, 'from', urls.udps());

  const querySetter = ({ location: loc, nsValues }) => {
    const url = buildUrl(loc, nsValues);
    const { pathname, search } = loc;
    if (`${pathname}${search}` !== url) {
      history.push(url, loc.state);
    }
  };

  const queryGetter = () => {
    return get(source.resources, 'query', {});
  };

  const renderResultsPaneSubtitle = () => {
    if (source?.loaded()) {
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

  const renderFilterPaneHeader = () => {
    return (
      <PaneHeader paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />} />
    );
  };

  const renderResultsPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
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
        onClose={() => history.push(fromPath)}
        paneSub={renderResultsPaneSubtitle()}
        paneTitle={<FormattedMessage id="ui-erm-usage.harvester.jobs.paneTitle" />}
      />
    );
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
            defaultWidth="20%"
            renderHeader={renderFilterPaneHeader}
          >
            <JobsFilter filterGroups={filterGroups} {...renderProps} />
          </Pane>

          <Pane
            defaultWidth="fill"
            padContent={false}
            renderHeader={renderResultsPaneHeader}
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
                'status',
                'result'
              ]}
              formatter={resultsFormatter(formatMessage, stripes, source)}
              contentData={source.records() || []}
              columnMapping={{
                providerId: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.column.provider',
                }),
                type: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.column.type',
                }),
                startedAt: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.column.start',
                }),
                finishedAt: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.column.finish',
                }),
                duration: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.column.duration',
                }),
                status: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.filter.status',
                }),
                result: formatMessage({
                  id: 'ui-erm-usage.harvester.jobs.filter.result',
                }),
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
  filterGroups: PropTypes.arrayOf(PropTypes.object),
};

export default JobsView;
