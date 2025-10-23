import { useMemo } from 'react';

export const useFormValidation = () => {
  const validateForm = useMemo(
    () => (formData: any) => {
      // Basic validation logic
      if (!formData.title || formData.title.trim().length === 0) {
        return false;
      }
      if (!formData.description || formData.description.trim().length === 0) {
        return false;
      }
      if (!formData.category) {
        return false;
      }
      if (!formData.severity) {
        return false;
      }
      if (!formData.address || formData.address.trim().length === 0) {
        return false;
      }
      return true;
    },
    []
  );

  const cleanTitle = useMemo(
    () => (title: string) => {
      if (!title) return '';
      return title.trim().replace(/\s+/g, ' ');
    },
    []
  );

  return {
    validateForm,
    cleanTitle,
  };
};
