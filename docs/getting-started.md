# UI ERM Usage - Getting started

## General information

The UI erm usage app uses a vendor finder plugin to link created usage data providers to vendors. Currently the [find vendor plugin](../plugins/ui-plugin-find-vendor/README.md "ui-plugin-find-vendor") is located in this project. It may be exported to its own project in the future. This is working similar to the [ui-plugin-find-user](https://github.com/folio-org/ui-plugin-find-user "User-finder plugin for Stripes").

## Run as dev environment

### Prerequisites

* [Stripes CLI](https://github.com/folio-org/stripes-cli) needs to be installed

* [stripes-core](https://github.com/folio-org/stripes-core) checked out, _yarn installed_ and linked via [alias-command](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#aliases)

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

