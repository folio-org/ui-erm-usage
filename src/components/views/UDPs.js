import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { noop } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';

import { AppIcon, IfPermission } from '@folio/stripes/core';
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';
import {
  MultiColumnList,
  Pane,
  Button,
  HasCommand,
  Icon,
  NoValue,
  PaneHeader,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';

import UDPFilters from '../UDPFilters/UDPFilters';
import urls from '../../util/urls';

const UDPs = ({
  children,
  contentRef,
  data = {},
  history,
  location,
  intl,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  selectedRecordId,
  source,
  syncToLocationSearch = true,
  visibleColumns = ['label', 'harvestingStatus', 'latestStats', 'aggregator'],
}) => {
  const resultsPaneTitleRef = useRef();

  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const [recordsArePending, setRecordsArePending] = useState(true);
  const [searchPending, setSearchPending] = useState(false);

  useEffect(() => {
    setRecordsArePending(source?.pending() ?? true);
  }, [source]);

  const onSearchComplete = () => {
    const hasResults = !!(source?.totalCount() ?? 0);

    setSearchPending(false);

    // Focus the pane header if we have results to minimize tabbing distance
    if (
      hasResults &&
      resultsPaneTitleRef.current) {
      resultsPaneTitleRef.current.focus();
    }
  };

  useEffect(() => {
    if (searchPending && recordsArePending === false) {
      onSearchComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPending, recordsArePending]);

  const handleSubmitSearch = (e, onSubmitSearch) => {
    setSearchPending(true);

    onSubmitSearch(e);
  };

  const columnMapping = {
    label: <FormattedMessage id="ui-erm-usage.information.providerName" />,
    harvestingStatus: <FormattedMessage id="ui-erm-usage.information.harvestingStatus" />,
    latestStats: <FormattedMessage id="ui-erm-usage.information.latestStatistics" />,
    aggregator: <FormattedMessage id="ui-erm-usage.information.aggregator" />,
  };

  const columnWidths = {
    label: 300,
    harvestingStatus: 150,
    latestStats: 150,
    aggregator: 200,
  };

  const getAggregatorName = (udp) => {
    return (udp.harvestingConfig.harvestVia === 'aggregator' && udp.harvestingConfig.aggregator) ?
      udp.harvestingConfig.aggregator.name :
      <NoValue />;
  };

  const formatter = {
    label: (udp) => udp.label,
    harvestingStatus: (udp) => (
      <FormattedMessage
        id={`ui-erm-usage.general.status.${udp.harvestingConfig.harvestingStatus}`}
      />
    ),
    latestStats: (udp) => udp.latestReport,
    aggregator: (udp) => getAggregatorName(udp),
  };

  const rowURL = (id) => {
    return `${urls.udpView(id)}${searchString}`;
  };

  const rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = rowURL(rowData.id);
    }

    return (
      <RowComponent
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[rowData.name].join('...')}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </RowComponent>
    );
  };

  const toggleFilterPane = () => {
    setFilterPaneIsVisible(curState => !curState);
  };

  const createNewUdp = () => {
    history.push(`${urls.udpCreate()}${searchString}`);
  };

  const shortcuts = [
    {
      name: 'new',
      handler: createNewUdp,
    },
  ];

  const renderIsEmptyMessage = (query, result) => {
    if (!result) {
      return <FormattedMessage id="ui-erm-usage.noSourceYet" />;
    }

    return (
      <div data-test-udps-no-results-message>
        <NoResultsMessage
          source={result}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  const renderResultsFirstMenu = (filters) => {
    const filterCount =
      filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  const renderResultsPaneSubtitle = (result) => {
    if (result && result.loaded()) {
      const count = result.totalCount();
      return (
        <FormattedMessage
          id="stripes-smart-components.searchResultsCountHeader"
          values={{ count }}
        />
      );
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  const renderActionMenu = () => {
    return (
      <>
        <div>
          <IfPermission perm="ui-erm-usage.udp.create">
            <Button
              aria-label={intl.formatMessage({ id: 'ui-erm-usage.udp.form.createUDP' })}
              buttonStyle="dropDownItem"
              id="clickable-new-udp"
              marginBottom0
              to={`${urls.udpCreate()}${searchString}`}
            >
              <Icon icon="plus-sign">
                <FormattedMessage id="stripes-smart-components.new" />
              </Icon>
            </Button>
          </IfPermission>
        </div>
        <div>
          <IfPermission perm="ui-erm-usage-harvester.jobs.view">
            <Button
              aria-label={intl.formatMessage({ id: 'ui-erm-usage.harvester.jobs.show' })}
              buttonStyle="dropDownItem"
              id="clickable-harvester-logs"
              marginBottom0
              to={{ pathname: urls.jobsView, search: '?sort=-startedAt', state: { from: location.pathname + location.search } }}
            >
              <Icon icon="arrow-right">
                <FormattedMessage id="ui-erm-usage.harvester.jobs.show" />
              </Icon>
            </Button>
          </IfPermission>
        </div>
      </>
    );
  };

  const renderFilterPaneHeader = () => {
    return (
      <PaneHeader
        lastMenu={
          <PaneMenu>
            <CollapseFilterPaneButton onClick={toggleFilterPane} />
          </PaneMenu>
        }
        paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
      />
    );
  };

  const renderResultsPaneHeader = (activeFilters, result) => {
    return (
      <PaneHeader
        appIcon={<AppIcon app="erm-usage" />}
        firstMenu={renderResultsFirstMenu(activeFilters)}
        actionMenu={renderActionMenu}
        id="pane-list-udps"
        paneTitle={<FormattedMessage id="ui-erm-usage.usage-data-providers" />}
        paneTitleRef={resultsPaneTitleRef}
        paneSub={renderResultsPaneSubtitle(result)}
      />
    );
  };

  const query = queryGetter() || {};
  const count = source ? source.totalCount() : 0;
  const sortOrder = query.sort || '';

  return (
    <HasCommand commands={shortcuts}>
      <div data-test-udp-instances ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{
            harvestingStatus: ['active'],
          }}
          initialSearchState={{ query: '' }}
          initialSortState={{ sort: 'label' }}
          queryGetter={queryGetter}
          querySetter={querySetter}
          syncToLocationSearch={syncToLocationSearch}
        >
          {({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            getFilterHandlers,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll,
          }) => {
            const disableReset = () => !filterChanged && !searchChanged;
            return (
              <Paneset id="udps-paneset">
                {filterPaneIsVisible && (
                  <Pane
                    defaultWidth="20%"
                    id="pane-filter-udps"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form
                      onSubmit={e => handleSubmitSearch(e, onSubmitSearch)}
                    >
                      <div>
                        <SearchField
                          ariaLabel={intl.formatMessage({
                            id: 'ui-erm-usage.udp.searchInputLabel',
                          })}
                          autoFocus
                          data-test-udp-search-input
                          id="input-udp-search"
                          inputRef={searchField}
                          name="query"
                          onChange={getSearchHandlers().query}
                          onClear={getSearchHandlers().reset}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={
                            !searchValue.query || searchValue.query === ''
                          }
                          fullWidth
                          id="clickable-search-udps"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <div>
                        <Button
                          buttonStyle="none"
                          id="clickable-reset-all"
                          disabled={disableReset()}
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                      </div>
                    </form>
                    <UDPFilters
                      activeFilters={activeFilters.state}
                      data={data}
                      filterHandlers={getFilterHandlers()}
                    />
                  </Pane>
                )}
                <Pane
                  defaultWidth="fill"
                  noOverflow
                  padContent={false}
                  id="pane-list-udps"
                  renderHeader={() => renderResultsPaneHeader(activeFilters, source)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={columnMapping}
                    columnWidths={columnWidths}
                    contentData={data.udps}
                    formatter={formatter}
                    id="list-udps"
                    isEmptyMessage={renderIsEmptyMessage(query, source)}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={
                      sortOrder.startsWith('-') ? 'descending' : 'ascending'
                    }
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={visibleColumns}
                  />
                </Pane>
                {children}
              </Paneset>
            );
          }}
        </SearchAndSortQuery>
      </div>
    </HasCommand>
  );
};

UDPs.propTypes = {
  children: PropTypes.object,
  contentRef: PropTypes.object,
  data: PropTypes.shape(),
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  intl: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    pending: PropTypes.func.isRequired,
    totalCount: PropTypes.func,
  }),
  syncToLocationSearch: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default injectIntl(UDPs);
