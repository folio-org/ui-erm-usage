import { useRef } from 'react';

import {
  fireEvent,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { useClickOutside } from './useClickOutside';

const TestComponent = ({ onOutsideClick }) => {
  const ref = useRef(null);
  const overlayRef = useRef(null);
  useClickOutside(ref, overlayRef, onOutsideClick);

  return (
    <div>
      <button type="button">Outside Button</button>
      <div ref={ref}>
        <input placeholder="Inside Input" />
      </div>
      <div ref={overlayRef}>
        <button type="button">Overlay Button</button>
      </div>
    </div>
  );
};

describe('useClickOutside', () => {
  let handler;

  beforeEach(() => {
    handler = jest.fn();
    render(<TestComponent onOutsideClick={handler} />);
  });

  it('should call handler if clicking OUTSIDE the elements', () => {
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside Button' }));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should NOT call handler if clicking INSIDE the main element', () => {
    fireEvent.mouseDown(screen.getByPlaceholderText('Inside Input'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('should NOT call handler if clicking INSIDE the overlay element', () => {
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Overlay Button' }));
    expect(handler).not.toHaveBeenCalled();
  });
});
