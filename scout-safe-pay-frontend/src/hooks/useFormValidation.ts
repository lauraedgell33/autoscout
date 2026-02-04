'use client';

import { useState, useCallback, useMemo } from 'react';

// Validation rule types
type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'match'; field: string; message?: string }
  | { type: 'custom'; validate: (value: string, formValues: Record<string, string>) => boolean; message: string };

interface FieldConfig {
  rules: ValidationRule[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface FormConfig {
  [fieldName: string]: FieldConfig;
}

interface FormState {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

interface UseFormValidationReturn {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFieldValue: (field: string, value: string) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  validateField: (field: string) => string | null;
  validateForm: () => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  getFieldProps: (fieldName: string) => {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  };
}

// Default error messages
const defaultMessages: Record<string, string> = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minLength: 'This field is too short',
  maxLength: 'This field is too long',
  pattern: 'Please enter a valid value',
  min: 'Value is too small',
  max: 'Value is too large',
  match: 'Fields do not match',
};

// Email regex pattern
const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function useFormValidation(
  config: FormConfig,
  initialValues: Record<string, string> = {}
): UseFormValidationReturn {
  // Initialize state
  const [state, setState] = useState<FormState>(() => {
    const values: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    
    Object.keys(config).forEach(field => {
      values[field] = initialValues[field] || '';
      touched[field] = false;
    });
    
    return {
      values,
      errors: {},
      touched,
      isValid: false,
      isSubmitting: false,
      isDirty: false,
    };
  });

  // Validate a single field
  const validateField = useCallback((field: string): string | null => {
    const fieldConfig = config[field];
    if (!fieldConfig) return null;

    const value = state.values[field] || '';

    for (const rule of fieldConfig.rules) {
      switch (rule.type) {
        case 'required':
          if (!value.trim()) {
            return rule.message || defaultMessages.required;
          }
          break;
        
        case 'email':
          if (value && !emailPattern.test(value)) {
            return rule.message || defaultMessages.email;
          }
          break;
        
        case 'minLength':
          if (value && value.length < rule.value) {
            return rule.message || `Must be at least ${rule.value} characters`;
          }
          break;
        
        case 'maxLength':
          if (value && value.length > rule.value) {
            return rule.message || `Must be no more than ${rule.value} characters`;
          }
          break;
        
        case 'pattern':
          if (value && !rule.value.test(value)) {
            return rule.message || defaultMessages.pattern;
          }
          break;
        
        case 'min':
          if (value && Number(value) < rule.value) {
            return rule.message || `Must be at least ${rule.value}`;
          }
          break;
        
        case 'max':
          if (value && Number(value) > rule.value) {
            return rule.message || `Must be no more than ${rule.value}`;
          }
          break;
        
        case 'match':
          if (value !== state.values[rule.field]) {
            return rule.message || defaultMessages.match;
          }
          break;
        
        case 'custom':
          if (!rule.validate(value, state.values)) {
            return rule.message;
          }
          break;
      }
    }

    return null;
  }, [config, state.values]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(config).forEach(field => {
      const error = validateField(field);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setState(prev => ({
      ...prev,
      errors,
      isValid,
      touched: Object.keys(config).reduce((acc, field) => ({ ...acc, [field]: true }), {}),
    }));

    return isValid;
  }, [config, validateField]);

  // Handle input change
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldConfig = config[name];

    setState(prev => {
      const newValues = { ...prev.values, [name]: value };
      const newState = {
        ...prev,
        values: newValues,
        isDirty: true,
      };

      // Validate on change if configured
      if (fieldConfig?.validateOnChange) {
        const error = validateField(name);
        newState.errors = {
          ...prev.errors,
          [name]: error || '',
        };
      }

      return newState;
    });
  }, [config, validateField]);

  // Handle input blur
  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    const fieldConfig = config[name];

    setState(prev => {
      const newState = {
        ...prev,
        touched: { ...prev.touched, [name]: true },
      };

      // Validate on blur (default behavior)
      if (fieldConfig?.validateOnBlur !== false) {
        const error = validateField(name);
        newState.errors = {
          ...prev.errors,
          [name]: error || '',
        };
      }

      return newState;
    });
  }, [config, validateField]);

  // Set field value programmatically
  const setFieldValue = useCallback((field: string, value: string) => {
    setState(prev => ({
      ...prev,
      values: { ...prev.values, [field]: value },
      isDirty: true,
    }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((field: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  // Set field touched programmatically
  const setFieldTouched = useCallback((field: string, touched: boolean) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: touched },
    }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    const values: Record<string, string> = {};
    const touched: Record<string, boolean> = {};
    
    Object.keys(config).forEach(field => {
      values[field] = initialValues[field] || '';
      touched[field] = false;
    });

    setState({
      values,
      errors: {},
      touched,
      isValid: false,
      isSubmitting: false,
      isDirty: false,
    });
  }, [config, initialValues]);

  // Set submitting state
  const setSubmitting = useCallback((submitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting: submitting }));
  }, []);

  // Get props for a field (convenient helper)
  const getFieldProps = useCallback((fieldName: string) => {
    const error = state.touched[fieldName] ? state.errors[fieldName] : undefined;
    const errorId = `${fieldName}-error`;
    
    return {
      name: fieldName,
      value: state.values[fieldName] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      error,
      'aria-invalid': !!error,
      'aria-describedby': error ? errorId : undefined,
    };
  }, [state.values, state.errors, state.touched, handleChange, handleBlur]);

  // Calculate isValid
  const isValid = useMemo(() => {
    return Object.keys(config).every(field => !validateField(field));
  }, [config, validateField]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isValid,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    setSubmitting,
    getFieldProps,
  };
}

export default useFormValidation;
