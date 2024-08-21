jest.mock(
  '@folio/stripes/core',
  () => {
    const STRIPES = {
      actionNames: [],
      clone: () => ({ ...STRIPES }),
      connect: (Component) => Component,
      config: {},
      currency: 'USD',
      hasInterface: () => true,
      hasPerm: jest.fn().mockReturnValue(true),
      locale: 'en-US',
      logger: {
        log: () => {},
      },
      okapi: {
        tenant: 'diku',
        token: 'abc',
        url: 'https://folio-testing-okapi.dev.folio.org',
      },
      plugins: {},
      setBindings: () => {},
      setCurrency: () => {},
      setLocale: () => {},
      setSinglePlugin: () => {},
      setTimezone: () => {},
      setToken: () => {},
      store: {
        getState: () => ({
          okapi: {
            token: 'abc',
          },
        }),
        dispatch: () => {},
        subscribe: () => {},
        replaceReducer: () => {},
      },
      timezone: 'UTC',
      user: {
        perms: {},
        user: {
          id: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
          username: 'diku_admin',
        },
      },
      withOkapi: true,
    };

    const stripesConnect = (Component) => ({
      mutator,
      resources,
      stripes,
      ...rest
    }) => {
      if (Component.manifest === null || Component.manifest === undefined) {
        const fakeStripes = stripes || STRIPES;
        return <Component {...rest} stripes={fakeStripes} />;
      }
      const fakeMutator =
        mutator ||
        Object.keys(Component.manifest).reduce((acc, mutatorName) => {
          const returnValue = Component.manifest[mutatorName].records
            ? []
            : {};

          acc[mutatorName] = {
            GET: jest.fn().mockReturnValue(Promise.resolve(returnValue)),
            PUT: jest.fn().mockReturnValue(Promise.resolve()),
            POST: jest.fn().mockReturnValue(Promise.resolve()),
            DELETE: jest.fn().mockReturnValue(Promise.resolve()),
            reset: jest.fn(),
          };

          return acc;
        }, {});

      const fakeResources =
        resources ||
        Object.keys(Component.manifest).reduce((acc, resourceName) => {
          acc[resourceName] = {
            records: [],
            hasLoaded: true,
          };

          return acc;
        }, {});

      const fakeStripes = stripes || STRIPES;

      return (
        <Component
          {...rest}
          mutator={fakeMutator}
          resources={fakeResources}
          stripes={fakeStripes}
        />
      );
    };

    STRIPES.connect = stripesConnect;

    return {
      ...jest.requireActual('@folio/stripes/core'),
      stripesConnect,

      useStripes: () => STRIPES,

      withStripes: (Component) => ({ stripes, ...rest }) => {
        const fakeStripes = stripes || STRIPES;

        return <Component {...rest} stripes={fakeStripes} />;
      },

      // eslint-disable-next-line react/prop-types
      AppContextMenu: (props) => <>{props.children()}</>,

      // eslint-disable-next-line react/prop-types
      Pluggable: (props) => <>{props.children}</>,
    };
  },
  { virtual: true }
);
