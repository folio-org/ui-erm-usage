# UI ERM Usage - Getting started

## Run as dev environment

### Prerequisites

* [Stripes CLI](https://github.com/folio-org/stripes-cli) needs to be installed
* [ui-vendors](https://github.com/folio-org/ui-vendors) checked out, _yarn installed_ and linked via [alias-command](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#aliases)

  * As long as the [pull request](https://github.com/folio-org/ui-vendors/pull/30) is not merged, use this [enable-find-plugin branch](https://github.com/rchr/ui-vendors/tree/enable-find-plugin). It enables ui-vendors to be used in a plugin, which we use to find vendors.

* [ui-users](https://github.com/folio-org/ui-users) (only if you need it) checkout out, _yarn installed_ and linked via [alias-command](https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#aliases)

### Install dependencies

Open a terminal in the directory of this project and issue the command:

```yarn install```

### Start Stripes

Open a terminal in the directory of this project and issue the command:

```stripes serve stripes.config.js```

