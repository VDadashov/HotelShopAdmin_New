import React from 'react';
import { useTranslation } from 'react-i18next';

const GalleryForm = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{t('gallery.addItem')}</h2>
      <p className="text-gray-600">Gallery form component will be implemented here</p>
    </div>
  );
};

export default GalleryForm; 