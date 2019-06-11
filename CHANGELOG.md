# Change history for ui-erm-usage

## 2.2.1 (https://github.com/folio-org/ui-erm-usage/tree/v2.2.1) (2019-06-11)
* Bugfix: Use parentResource instead of detailsProps in UsagedataProviderForm.

## 2.2.0 (https://github.com/folio-org/ui-erm-usage/tree/v2.2.0) (2019-06-11)
* Fix typo database report DRx -> DBx (UIEUS-72)
* Add tags functionality (UIEUS-62)
* Enable to configure number of harvesting tries (UIEUS-11, UIEUS-79)
* Warn user before deleting UDP (UIEUS-60)
* Support multiple report types for csv download (UIEUS-55)
* Remove reference to platform and vendor (UIEUS-65)

## 2.1.0 (https://github.com/folio-org/ui-erm-usage/tree/v2.1.0) (2019-05-07)
* Use BigTest for testing
* Fetch harvester implementations from backend on demand

## 2.0.0 (https://github.com/folio-org/ui-erm-usage/tree/v2.0.0) (2019-03-22)
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
