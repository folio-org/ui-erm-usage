import { useRef, useState } from 'react';

import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import { useFocusManagement } from './useFocusManagement';

function TestComponent() {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  useFocusManagement(dialogRef, open);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>Open Dialog</button>
      <button type="button" onClick={() => setOpen(false)}>Close Dialog</button>

      <input placeholder="Outside Input" data-testid="outside-input" />

      {open && (
        <div
          tabIndex={-1}
          ref={dialogRef}
          data-testid="dialog"
        >
          Dialog Content
        </div>
      )}
    </div>
  );
}

describe('useFocusManagement', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should focus dialog when opened', () => {
    render(<TestComponent />);

    const outsideInput = screen.getByTestId('outside-input');
    outsideInput.focus();
    expect(document.activeElement).toBe(outsideInput);

    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));
    jest.advanceTimersByTime(150);

    const dialog = screen.getByTestId('dialog');
    expect(document.activeElement).toBe(dialog);
  });

  it('should restore focus to previously focused element when closed', () => {
    render(<TestComponent />);

    const outsideInput = screen.getByTestId('outside-input');
    outsideInput.focus();

    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }));
    jest.advanceTimersByTime(150);

    expect(document.activeElement).toBe(screen.getByTestId('dialog'));

    fireEvent.click(screen.getByRole('button', { name: 'Close Dialog' }));

    expect(document.activeElement).toBe(outsideInput);
  });
});
