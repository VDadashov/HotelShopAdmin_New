import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfileSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-[rgb(var(--primary-brand))] rounded-full flex items-center justify-center mb-2">
            <SettingsIcon className="w-8 h-8 text-black" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('profileSettings.title')}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{t('profileSettings.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">{t('profileSettings.placeholder')}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings; 