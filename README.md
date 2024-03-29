# ui-erm-usage

Copyright (C) 2018-2022 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

![Development funded by European Regional Development Fund (EFRE)](EFRE_2015_quer_RGB_klein.jpg)


## Introduction

The ERM-Usage UI Module, or `ui-erm-usage`, is a Stripes UI module for managing usage statistics. It allows to enter credentials for accessing usage data providers. These credentials are used by the backend module [mod-erm-usage](https://github.com/folio-org/mod-erm-usage) to harvest usage statistics periodically.

## Prerequisites

In order to view and log into the platform being served up, a suitable Okapi backend will need to be running. The [Folio testing-backend](https://app.vagrantup.com/folio/boxes/testing-backend) Vagrant box should work if your app does not yet have its own backend module.

Additionally, until it is part of the Okapi backends, the [mod-erm-usage](https://github.com/folio-org/mod-erm-usage) module needs to be running.

## Developing and Contributing to ERM-Usage/ERM Modules

* See manual in [FOLIO ERM platform](https://github.com/folio-org/platform-erm#developing-and-contributing-to-erm-modules).
* If you want to clone ui-erm-usage locally to make local modifications or contribute to it, select _ui-erm-usage_ as a module when executing `stripes workspace`.

## Running

Note that the following commands require that [`stripes-cli`](https://github.com/folio-org/stripes-cli) is installed globally.

Run the following from the ui-erm directory to serve `ui-erm-usage` by itself using a development server:
```
stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the `--hasAllPerms` option to display the app in the UI navigation. For example:
```
stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than http://localhost:9130, pass the `--okapi` and `--tenant` options.
```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

## Additional information

Read the [Stripes Module Developer's Guide](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md).

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [UIEUS](https://issues.folio.org/browse/UIEUS)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)

