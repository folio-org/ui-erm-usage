# UI ERM Usage - Getting started

## General information

The UI erm usage app uses a vendor finder plugin to link created usage data providers to vendors. This is working similar to the [ui-plugin-find-user](https://github.com/folio-org/ui-plugin-find-user "User-finder plugin for Stripes"). However, to enable the plugin [ui-vendors](https://github.com/folio-org/ui-vendors "ui-vendors") needs to be changed, see this pull request [Enable find plugin #30](https://github.com/folio-org/ui-vendors/pull/30 "Enable find plugin").

## Run as dev environment

### Prerequisites

* [Stripes CLI](https://github.com/folio-org/stripes-cli) needs to be installed
* [ui-vendors](https://github.com/folio-org/ui-vendors) checked out, _yarn installed_ and linked via [alias-command](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#aliases)

  * As long as the [pull request](https://github.com/folio-org/ui-vendors/pull/30) is not merged, use this [enable-find-plugin branch](https://github.com/rchr/ui-vendors/tree/enable-find-plugin). It enables ui-vendors to be used in a plugin, which we use to find vendors.

* [ui-users](https://github.com/folio-org/ui-users) (only if you need it) checked out, _yarn installed_ and linked via [alias-command](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#aliases)

### Install dependencies

Open a terminal in the directory of this project and issue the command:

```
yarn install
```

### Start Stripes

Open a terminal in the directory of this project and issue the command:

```
stripes serve stripes.config.js
```

