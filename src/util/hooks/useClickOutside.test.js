import { useRef } from 'react';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useClickOutside } from './useClickOutside';

function TestComponent({ onOutsideClick }) {
  const ref = useRef(null);
  const overlayRef = useRef(null);
  useClickOutside(ref, overlayRef, onOutsideClick, true);

  return (
    <div>
      <button type="button">Outside Button</button>
      <div ref={ref}>
        <input placeholder="Inside Input" />
      </div>
    </div>
  );
}

describe('useClickOutside', () => {
  let handler;

  beforeEach(() => {
    jest.useFakeTimers();
    handler = jest.fn();
    render(<TestComponent onOutsideClick={handler} />);
    jest.runAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call handler if clicking OUTSIDE the element', () => {
    fireEvent.click(screen.getByRole('button', { name: 'Outside Button' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should NOT call handler if clicking INSIDE the element', () => {
    fireEvent.click(screen.getByPlaceholderText('Inside Input'));
    expect(handler).not.toHaveBeenCalled();
  });
});
