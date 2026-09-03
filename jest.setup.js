import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    json: () => Promise.resolve({}),
  }),
);

// Mock react-calendar to avoid ESM issues
jest.mock("react-calendar", () => {
  return function MockCalendar({ onChange, tileContent }) {
    return (
      <div data-testid="mock-calendar">
        <button onClick={() => onChange(new Date())}>Select Date</button>
      </div>
    );
  };
});

// Mock react-calendar/dist/Calendar.css
jest.mock("react-calendar/dist/Calendar.css", () => ({}));
