// jsdom does not implement ResizeObserver, which is used by stripes-components TextArea
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};
