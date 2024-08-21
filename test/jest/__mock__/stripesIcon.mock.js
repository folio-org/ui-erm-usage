jest.mock('@folio/stripes-components/lib/Icon', () => {
  return ({ children }) => (
    <span>
      Icon
      <span>{children}</span>
    </span>
  );
});
