import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import { noop } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { AppIcon, IfPermission } from '@folio/stripes/core';
import {
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortSearchButton as FilterPaneToggle
} from '@folio/stripes/smart-components';
import {
  MultiColumnList,
  Pane,
  Button,
  Icon,
  PaneMenu,
  Paneset,
  SearchField
} from '@folio/stripes/components';

import UDPFilters from '../UDPFilters/UDPFilters';
import { urls } from '../utilities';

class UDPs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterPaneIsVisible: true
    };
  }

  columnMapping = {
    label: <FormattedMessage id="ui-erm-usage.information.providerName" />,
    harvestingStatus: (
      <FormattedMessage id="ui-erm-usage.information.harvestingStatus" />
    ),
    latestStats: (
      <FormattedMessage id="ui-erm-usage.information.latestStatistics" />
    ),
    aggregator: <FormattedMessage id="ui-erm-usage.information.aggregator" />
  };

  columnWidths = {
    label: 300,
    harvestingStatus: 150,
    latestStats: 150,
    aggregator: 200
  };

  formatter = {
    label: udp => udp.label,
    harvestingStatus: udp => udp.harvestingConfig.harvestingStatus,
    latestStats: udp => udp.latestReport,
    aggregator: udp => this.getAggregatorName(udp)
  };

  rowFormatter = row => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    let RowComponent;

    if (this.props.onSelectRow) {
      RowComponent = 'div';
    } else {
      RowComponent = Link;
      rowProps.to = this.rowURL(rowData.id);
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

  rowURL = id => {
    return `${urls.udpView(id)}${this.props.searchString}`;
  };

  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible
    }));
  };

  getAggregatorName = udp => {
    return udp.harvestingConfig.harvestVia === 'aggregator'
      ? udp.harvestingConfig.aggregator.name
      : '-';
  };

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return 'no source yet';
    }

    return (
      <div data-test-udps-no-results-message>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  renderResultsFirstMenu = filters => {
    const { filterPaneIsVisible } = this.state;
    const filterCount =
      filters.string !== '' ? filters.string.split(',').length : 0;
    const hideOrShowMessageId = filterPaneIsVisible
      ? 'stripes-smart-components.hideSearchPane'
      : 'stripes-smart-components.showSearchPane';

    return (
      <PaneMenu>
        <FormattedMessage
          id="stripes-smart-components.numberOfFilters"
          values={{ count: filterCount }}
        >
          {appliedFiltersMessage => (
            <FormattedMessage id={hideOrShowMessageId}>
              {hideOrShowMessage => (
                <FilterPaneToggle
                  visible={filterPaneIsVisible}
                  aria-label={`${hideOrShowMessage}...${appliedFiltersMessage}`}
                  onClick={this.toggleFilterPane}
                  badge={
                    !filterPaneIsVisible && filterCount
                      ? filterCount
                      : undefined
                  }
                />
              )}
            </FormattedMessage>
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  renderResultsPaneSubtitle = source => {
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

  renderResultsLastMenu() {
    if (this.props.disableRecordCreation) {
      return null;
    }

    return (
      <IfPermission perm="usagedataproviders.item.post">
        <PaneMenu>
          <FormattedMessage id="ui-erm-usage.udp.form.createUDP">
            {ariaLabel => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                id="clickable-new-udp"
                marginBottom0
                to={`${urls.udpCreate()}${this.props.searchString}`}
              >
                <FormattedMessage id="stripes-smart-components.new" />
              </Button>
            )}
          </FormattedMessage>
        </PaneMenu>
      </IfPermission>
    );
  }

  render() {
    const {
      children,
      contentRef,
      data,
      onNeedMoreData,
      onSelectRow,
      queryGetter,
      querySetter,
      selectedRecordId,
      source,
      syncToLocationSearch,
      visibleColumns
    } = this.props;

    const query = queryGetter() || {};
    const count = source ? source.totalCount() : 0;
    const sortOrder = query.sort || '';

    return (
      <div data-test-udps ref={contentRef}>
        <SearchAndSortQuery
          initialFilterState={{
            harvestingStatus: ['active']
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
            resetAll
          }) => {
            const disableReset = () => !filterChanged && !searchChanged;

            return (
              <Paneset id="udps-paneset">
                {this.state.filterPaneIsVisible && (
                  <Pane
                    defaultWidth="20%"
                    onClose={this.toggleFilterPane}
                    paneTitle={
                      <FormattedMessage id="stripes-smart-components.searchAndFilter" />
                    }
                  >
                    <form onSubmit={onSubmitSearch}>
                      <div>
                        <FormattedMessage id="ui-erm-usage.udp.searchInputLabel">
                          {ariaLabel => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              data-test-udp-search-input
                              id="input-udp-search"
                              inputRef={this.searchField}
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                          )}
                        </FormattedMessage>
                        <Button
                          buttonStyle="primary"
                          disabled={
                            !searchValue.query || searchValue.query === ''
                          }
                          fullWidth
                          id="clickable-search-agreements"
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
                  appIcon={<AppIcon app="erm-usage" />}
                  defaultWidth="fill"
                  firstMenu={this.renderResultsFirstMenu(activeFilters)}
                  lastMenu={this.renderResultsLastMenu()}
                  padContent={false}
                  paneTitle="USAGE DATA PROVIDERS"
                  paneSub={this.renderResultsPaneSubtitle(source)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={this.columnMapping}
                    columnWidths={this.columnWidths}
                    contentData={data.udps}
                    formatter={this.formatter}
                    id="list-udps"
                    isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onRowClick={onSelectRow}
                    rowFormatter={this.rowFormatter}
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
    );
  }
}

UDPs.propTypes = Object.freeze({
  children: PropTypes.object,
  contentRef: PropTypes.object,
  data: PropTypes.shape(),
  disableRecordCreation: PropTypes.bool,
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func
  }),
  syncToLocationSearch: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
});

UDPs.defaultProps = {
  data: {},
  searchString: '',
  syncToLocationSearch: true,
  visibleColumns: ['label', 'harvestingStatus', 'latestStats', 'aggregator']
};

export default UDPs;
