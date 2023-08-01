# Change history for ui-erm-usage

## 7.1.0 (IN PROGRESS)
* Update 'Harvester started' message ([UIEUS-331](https://issues.folio.org/browse/UIEUS-331))
* Fix error handling in PeriodicHarvestingManager ([UIEUS-333](https://issues.folio.org/browse/UIEUS-333))
* Fix localization issues in periodic harvesting settings ([UIEUS-332](https://issues.folio.org/browse/UIEUS-332))
* Display error message for failed jobs ([UIEUS-325](https://issues.folio.org/browse/UIEUS-325))
* Set initialValue for periodic interval field in periodic harvesting settings ([UIEUS-329](https://issues.folio.org/browse/UIEUS-329))
* Add settings page for harvester logs ([UIEUS-330](https://issues.folio.org/browse/UIEUS-330))
* Add 'Running status' and 'Result' information to 'Harvester logs' view and filter ([UIEUS-304](https://issues.folio.org/browse/UIEUS-304))
* Avoid private paths in stripes-core imports ([UIEUS-322](https://issues.folio.org/browse/UIEUS-322))
* Fix test warnings 'No metadata' ([UIEUS-320](https://issues.folio.org/browse/UIEUS-320))
* Leverage cookie-based authentication in all API requests. Refs UIEUS-314.

## [7.0.0](https://github.com/folio-org/ui-erm-usage/tree/v7.0.0) (2023-02-20)
* Upgrade `react-redux` to v8 ([UIEUS-318](https://issues.folio.org/browse/UIEUS-318)) 
* Upgrade to Stripes v8 ([UIEUS-317](https://issues.folio.org/browse/UIEUS-317))
* Re-order fields in UDP create/edit screen ([UIEUS-315](https://issues.folio.org/browse/UIEUS-315))
* Update overview info shown in UDP details pane ([UIEUS-306](https://issues.folio.org/browse/UIEUS-306))
* Remove remaining BigTest artifacts ([FAT-89](https://issues.folio.org/browse/FAT-89))
* Access filtered harvester jobs from UDP details pane ([UIEUS-305](https://issues.folio.org/browse/UIEUS-305))
* Add filter pane to harvester jobs screen ([UIEUS-303](https://issues.folio.org/browse/UIEUS-303)) 
* Activate 'Save & close' button on form change ([UIEUS-310](https://issues.folio.org/browse/UIEUS-310))

## [6.3.0](https://github.com/folio-org/ui-erm-usage/tree/v6.3.0) (2022-10-25)
* Add empty values for selectboxes (UIEUS-307)
* Harvester logs screen (UIEUS-302)
* Use default values in the Create screen for a new UDP (UIEUS-301)

## [6.2.0](https://github.com/folio-org/ui-erm-usage/tree/v6.2.0) (2022-06-30)
* Not possible to set both RequestorId and ApiKey (UIEUS-297)
* No results displayed on first open (UIEUS-296)
* Refactor app permissions (UIEUS-292)
* Action items always visible (UIEUS-295)
* Replace babel-eslint with @babel/eslint-parser (UIEUS-291)

## [6.1.1](https://github.com/folio-org/ui-erm-usage/tree/v6.1.1) (2022-03-30)
* Permission "Settings (eUsage): Can view and edit settings" doesn't allow create/edit Aggregator record (UIEUS-288)
* An error occurs when trying to save changes to eUsage settings (UIEUS-287)

## [6.1.0](https://github.com/folio-org/ui-erm-usage/tree/v6.1.0) (2022-02-24)
* Refactor psets away from backend ".all" permissions (UIEUS-281)
* Corrupted data when downloading binary files (UIEUS-285)
* Entering a search should move focus to Results list pane header (UIEUS-221)

## [6.0.0](https://github.com/folio-org/ui-erm-usage/tree/v6.0.0) (2021-10-04)
* Clicking aggregator name link results in error (UIEUS-276)
* HavestingConfigurationForm not updating required fields correctly (UIEUS-274)
* Increment stripes to v7 (UIEUS-271)
* SUSHI error messages not displayed correctly in ReportInfo modal (UIEUS-275)
* Rename "COUNTER reports" to "usage reports" in permission names (UIEUS-235)
* Console error when editing a UDP (UIEUS-273)
* Restrict editing options on usage data providers (UIEUS-269)
* Possible to create providers without requested reports (UIEUS-272)
* No required configuration fields for inactive harvesting status (UIEUS-266)
* Support Standard Report Views in UI (UIEUS-265)
* Remove isWithinScope property (UIEUS-270)
* Pass data into "ui-agreements-extension" plugin
* Fix propypes-checking error

## [5.1.0](https://github.com/folio-org/ui-erm-usage/tree/v5.1.0) (2021-06-14)
* Add a pluggable surface of type `ui-agreements-extension` (UIEUS-268)
* Apply baseline keyboard shortcuts (UIEUS-253)
* Migration from BigTest to RTL/Jest (UIEUS-229)
* Move action buttons to the actions menu (UIEUS-250)
* Flatten accordion hierarchy (UIEUS-251)
* Delete multiple reports (UIEUS-247)
* Implement keyboard shortcut modal (UIEUS-260)
* Compile Translation Files into AST Format (UIEUS-258)
* Prefer @folio/stripes exports to private paths when importing components (UIEUS-263)

## [5.0.1](https://github.com/folio-org/ui-erm-usage/tree/v5.0.1) (2021-04-20)
* Bugfix: Do not validate vendor's SUSHI URL when creating UDP that fetches statistics via aggregator (UIEUS-254)
* Bugfix: Validate aggregator as mandatory when when harvesting changing from SUSHI to aggregator (UIEUS-256)

## [5.0.0](https://github.com/folio-org/ui-erm-usage/tree/v5.0.0) (2021-03-18)
* Bugfix: Translation of editReason depends on trailing space (UIEUS-252)
* Reload UDP detail view on changes (UIEUS-246)
* Add missing translations (UIEUS-248)
* Bugfix: Field value for "service url" is not validated in UI (UIEUS-249)
* Improve layout of SUSHI error messages displayed in report info modal (UIEUS-242)
* Bugfix: Tags filter not working (UIEUS-244)
* Bugfix: Broken layout of Non-Counter upload modal (UIEUS-241)
* Bugfix: Add platform to Sushi credentials (UIEUS-240)
* Upgrade stripes-cli to v2 (UIEUS-239)
* Upgrade to stripes v6 (UIEUS-232)
* Filter UDPs by available report type (UIEUS-222)
* Add info if report was edited manually to report info (UIEUS-224)
* Reports can be flagged as edited when uploading (UIEUS-223)
* Non-counter upload can store link (UIEUS-227)
* Remove deprecated `<Dropdown>` data-role: "toggle" (UIEUS-228)

## [4.0.2](https://github.com/folio-org/ui-erm-usage/tree/v4.0.2) (2021-01-04)
* Bugfix: Permission "Settings (eUsage): Can view and edit settings" does not enable settings (UIEUS-230)

## [4.0.1](https://github.com/folio-org/ui-erm-usage/tree/v4.0.1) (2020-11-03)
* Make permission ui-erm-usage.module.enabled invisible (UIEUS-218)

## [4.0.0](https://github.com/folio-org/ui-erm-usage/tree/v4.0.0) (2020-10-08)
* Increment `@folio/stripes` to `v5.0` and `react-router` to `v5.2` (and, bugfix, move it to peer)
* Replace deprecated `babel-polyfill` with `core-js` and `regenerator-runtime`
* COUNTER reports can be downloaded as xlsx files (UIEUS-177)
* UDP credentials can be downloaded as xlsx files (UIEUS-179)
* Display last harvesting datetime to UDP details view (UIEUS-185)
* Support download COUNTER report as json or xml (UIEUS-199)
* UI gives feedback when a (multi-month) report is generated for download (UIEUS-209)
* Bugfix: Report download does not start when switching udp (UIEUS-211)
* UI gives feedback when a (multi-month) report is uploaded (UIEUS-212)

## [3.0.0](https://github.com/folio-org/ui-erm-usage/tree/v3.0.0) (2020-06-04)
* Improve screenreading (UIEUS-170, UIEUS-171, UIEUS-172)
* Download COP5 reports for a range of several month as csv (UIEUS-162, MODEUS-55)
* Update to `stripes` `v4.0`, `react-intl` `v4.5.3` (STRIPES-672)

## [2.7.1](https://github.com/folio-org/ui-erm-usage/tree/v2.7.1) (2020-03-26)
* Bugfix: Error when opening detail view of a usage data provider (UIEUS-167)

## [2.7.0](https://github.com/folio-org/ui-erm-usage/tree/v2.7.0) (2020-03-12)
* Ability to download COP5 CSV reports for single month (UIEUS-106)
* Fix accessibility issues (UIEUS-146, UIEUS-158, UIEUS-138, UIEUS-160, UIEUS-164, UIEUS-165)
* Performance improvement: Fetch sorted counter-reports from backend instead of sorting in frontend (UIEUS-134)
* Upgrade to Stripes 3.0

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
