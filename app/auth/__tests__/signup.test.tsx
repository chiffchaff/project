import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Signup from '../signup';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

describe('Signup Screen', () => {
  it('should show validation errors for empty fields', async () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    
    // Find the signup button and press it
    const signupButton = getByText('Create Account');
    fireEvent.press(signupButton);

    // Check if validation errors appear
    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
      expect(getByText('Phone number is required')).toBeTruthy();
      expect(getByText('Please select a role')).toBeTruthy();
    });
  });

  it('should handle valid form submission', async () => {
    const { getByText, getByPlaceholderText } = render(<Signup />);
    
    // Fill in the form
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your phone number'), '1234567890');
    fireEvent.changeText(getByPlaceholderText('Create a password'), 'password123');
    
    // Select role
    const ownerButton = getByText('Property Owner');
    fireEvent.press(ownerButton);
    
    // Submit form
    const signupButton = getByText('Create Account');
    fireEvent.press(signupButton);

    // Check if validation passes (no error messages)
    await waitFor(() => {
      expect(() => getByText('Name is required')).toThrow();
      expect(() => getByText('Email is required')).toThrow();
      expect(() => getByText('Password is required')).toThrow();
      expect(() => getByText('Phone number is required')).toThrow();
      expect(() => getByText('Please select a role')).toThrow();
    });
  });
});