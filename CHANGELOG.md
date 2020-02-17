# Change history for ui-erm-usage

## [2.6.1](https://github.com/folio-org/ui-erm-usage/tree/v2.6.1) (2020-02-17)
* Remove JavaScript optional chaining syntax (https://github.com/tc39/proposal-optional-chaining). Jenkins cannot build release with optional chaining.

## [2.6.0](https://github.com/folio-org/ui-erm-usage/tree/v2.6.0) (2020-02-17)
* Move Save/Delete/Cancel buttons to the footer (UIEUS-120)
* Use SearchAndSortQuery component instead of SearchAndSort (UIEUS-123)
* Filter usage data providers by tag (UIEUS-118)
* Filter usage data providers by counter reports' error type (UIEUS-117)
* Bugfix: Aggregator settings displays more than 10 aggregators (UIEUS-131)
* Use react final form in main components (UIEUS-133)
* Add info box on available report types for CSV download (UIEUS-135)

## [2.5.1](https://github.com/folio-org/ui-erm-usage/tree/v2.5.1) (2019-12-04)
* Bugfix: Use correct version if okapiInterface usage-data-providers (v2.3)

## [2.5.0](https://github.com/folio-org/ui-erm-usage/tree/v2.5.0) (2019-12-04)
* Bugfix: Correct handling of time zone in Timepicker in PeriodicHarvesting (UIEUS-124)
* Manage harvesting errors: filter providers by error occurance (UIEUS-103)
* Bugfix: Statistics table behaviour when changing providers (flashing of old data) (UIEUS-110)
* Improve accessibility (UIEUS-107)
* Integration of "record created/last updated" data for usage data providers (UIEUS-102)
* Add description to counter file upload (UIEUS-101)
* More general settings for aggregators (UIEUS-108)

## [2.4.0](https://github.com/folio-org/ui-erm-usage/tree/v2.4.0) (2019-09-10)
* enable and configure regular harvesting (UIEUS-99)
* Update detail view after edit (UIEUS-100)
* Only avaliable reports in dropdown box for download (UIEUS-94)
* Correct ordering of report types (UIEUS-96)
* Correct ordering of requested reports (UIEUS-95)
* Add notes app (UIEUS-61)
* Bugfix: Aggregator config mail only mandatory if configType is "Mail" (UIEUS-70)

## [2.3.0](https://github.com/folio-org/ui-erm-usage/tree/v2.3.0) (2019-07-23)
* Avaiable reports for CSV download: update info text in ui (UIEUS-81)
* Display single UDP (ERM-343)
* "Start harvester" button for an inactive provider is inactive (UIEUS-78)
* No error message, if harvester is not deployed (UIEUS-91)
* Report info is displayed in modal (UIEUS-89)

## [2.2.2](https://github.com/folio-org/ui-erm-usage/tree/v2.2.2) (2019-06-28)
* Bugfix: Display correct service type in harvesting configuration (UIEUS-88)
* Bufgix: Use default value for maxFailedAttempts if not defined (UIEUS-80)

## [2.2.1](https://github.com/folio-org/ui-erm-usage/tree/v2.2.1) (2019-06-11)
* Bugfix: Use parentResource instead of detailsProps in UsagedataProviderForm.

## [2.2.0](https://github.com/folio-org/ui-erm-usage/tree/v2.2.0) (2019-06-11)
* Fix typo database report DRx -> DBx (UIEUS-72)
* Add tags functionality (UIEUS-62)
* Enable to configure number of harvesting tries (UIEUS-11, UIEUS-79)
* Warn user before deleting UDP (UIEUS-60)
* Support multiple report types for csv download (UIEUS-55)
* Remove reference to platform and vendor (UIEUS-65)

## [2.1.0](https://github.com/folio-org/ui-erm-usage/tree/v2.1.0) (2019-05-07)
* Use BigTest for testing
* Fetch harvester implementations from backend on demand

## [2.0.0](https://github.com/folio-org/ui-erm-usage/tree/v2.0.0) (2019-03-22)
* Upload XML encoded Counter 4 reports (UIEUS-39)
* Ability to download counter reports as CSV for single and multiple months (for Counter 4 JR1 only) (UIEUS-36)
* Ability to start harvester for a single usagedata provider (UIEUS-2)
* Hide credentials in front end (e.g. for presentations)
* Display info when harvester failed to download certain reports
* Ability to delete counter reports (UIEUS-33)
* Improve search, sort and filter capabilities (UIEUS-34)
* Filterconfig of SearchAndSort component is dynamic dependent on aggregator definitions (UIEUS-34)

## [1.0.3](https://github.com/folio-org/ui-erm-usage/tree/v1.0.3) (2019-01-17)
* Bugfix: Use fixed names of settings permissions in AggregatorForm

## [1.0.2](https://github.com/folio-org/ui-erm-usage/tree/v1.0.2) (2019-01-09)
* Fix incorrect names of settings permissions to enable editing of Aggregators on the settings page

## [1.0.1](https://github.com/folio-org/ui-erm-usage/tree/v1.0.1) (2019-01-07)
* Fix incorrect names of settings permissions to enable editing of Aggregators on the settings page

## [1.0.0](https://github.com/folio-org/ui-erm-usage/tree/v1.0.0) (2018-12-07)
* Fix report download for Firefox
* Display start-harvester button only if needed interface is present
* Start tests with `--show` option

## [0.2.0](https://github.com/folio-org/ui-erm-usage/tree/v0.2.0) (2018-11-30)
* Added i18n

## 0.1.0
* CRUD usage data providers holding information to access counter statistics
* Ability to assign usage data providers to aggregators
