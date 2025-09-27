import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useGet } from '@/utils/hooks/useCustomQuery';
import { ENDPOINTS } from '@/utils/constants/Endpoints';
import { Loader2, User } from 'lucide-react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { data: user, isPending, isError } = useGet('profile', ENDPOINTS.profile);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin w-8 h-8 text-yellow-500" />
      </div>
    );
  }
  if (isError || !user) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-red-500 font-semibold">
        {t('profile.notFound')}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[400px] p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-[rgb(var(--primary-brand))] rounded-full flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-black" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">{t('profile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('profile.username')}:</span>
              <span className="ml-2 text-foreground">{user.username || '-'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('profile.email')}:</span>
              <span className="ml-2 text-foreground">{user.email || '-'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('profile.role')}:</span>
              <span className="ml-2 text-foreground">{user.role || '-'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 