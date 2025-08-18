import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "@src/containers/SearchBar";
import React from "react";

describe("SearchBar", () => {
  let onSearchMock;
  let onChangeMock;
  let currentValue;

  beforeEach(() => {
    jest.useFakeTimers();
    onSearchMock = jest.fn();
    onChangeMock = jest.fn();
    currentValue = "";
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test("renders with the correct placeholder", () => {
    const placeholderText = "Enter city name...";
    render(
      <SearchBar
        onSearch={onSearchMock}
        placeholder={placeholderText}
        value=""
        onChange={onChangeMock}
      />
    );
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
  });

  test("renders with the correct initial value", () => {
    const initialValue = "London";
    render(
      <SearchBar
        onSearch={onSearchMock}
        placeholder=""
        value={initialValue}
        onChange={onChangeMock}
      />
    );
    expect(screen.getByDisplayValue(initialValue)).toBeInTheDocument();
  });

  test("calls onChange when input value changes", () => {
    render(
      <SearchBar
        onSearch={onSearchMock}
        placeholder=""
        value=""
        onChange={onChangeMock}
      />
    );
    const input = screen.getByRole("textbox");
    act(() => {
      fireEvent.change(input, { target: { value: "New York" } });
    });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith("New York");
  });

  test("calls onSearch after debounce period with initial empty string call", () => {
    const { rerender } = render(
      <SearchBar
        onSearch={onSearchMock}
        placeholder=""
        value={currentValue}
        onChange={(newValue) => {
          currentValue = newValue;
        }}
      />
    );
    const input = screen.getByRole("textbox");

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith("");
    onSearchMock.mockClear();

    act(() => {
      fireEvent.change(input, { target: { value: "P" } });
      rerender(
        <SearchBar
          onSearch={onSearchMock}
          placeholder=""
          value={currentValue}
          onChange={(newValue) => {
            currentValue = newValue;
          }}
        />
      );
    });
    expect(onSearchMock).not.toHaveBeenCalled();

    act(() => {
      fireEvent.change(input, { target: { value: "Pa" } });
      rerender(
        <SearchBar
          onSearch={onSearchMock}
          placeholder=""
          value={currentValue}
          onChange={(newValue) => {
            currentValue = newValue;
          }}
        />
      );
    });
    expect(onSearchMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onSearchMock).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith("Pa");
  });

  test("calls onSearch with the latest debounced value", () => {
    const { rerender } = render(
      <SearchBar
        onSearch={onSearchMock}
        placeholder=""
        value={currentValue}
        onChange={(newValue) => {
          currentValue = newValue;
        }}
      />
    );
    const input = screen.getByRole("textbox");

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    onSearchMock.mockClear();

    act(() => {
      fireEvent.change(input, { target: { value: "L" } });
      rerender(
        <SearchBar
          onSearch={onSearchMock}
          placeholder=""
          value={currentValue}
          onChange={(newValue) => {
            currentValue = newValue;
          }}
        />
      );
      jest.advanceTimersByTime(500);
    });
    act(() => {
      fireEvent.change(input, { target: { value: "Lo" } });
      rerender(
        <SearchBar
          onSearch={onSearchMock}
          placeholder=""
          value={currentValue}
          onChange={(newValue) => {
            currentValue = newValue;
          }}
        />
      );
      jest.advanceTimersByTime(500);
    });
    act(() => {
      fireEvent.change(input, { target: { value: "Lon" } });
      rerender(
        <SearchBar
          onSearch={onSearchMock}
          placeholder=""
          value={currentValue}
          onChange={(newValue) => {
            currentValue = newValue;
          }}
        />
      );
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onSearchMock).toHaveBeenCalledTimes(1);
    expect(onSearchMock).toHaveBeenCalledWith("Lon");
  });

  test("prevents default form submission - custom event", () => {
    const preventDefaultSpy = jest.fn();
    const customEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    customEvent.preventDefault = preventDefaultSpy;

    render(
      <SearchBar
        onSearch={onSearchMock}
        placeholder=""
        value=""
        onChange={onChangeMock}
      />
    );
    const form = screen.getByRole("textbox").closest("form");
    act(() => {
      fireEvent(form, customEvent);
    });
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });
});