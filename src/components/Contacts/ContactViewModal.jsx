import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseViewModal from "@/components/common/modals/BaseViewModal";
import { Mail, User, MessageSquare, CheckCircle2, XCircle, Calendar } from "lucide-react";
import Badge from '../ui/badge';

const ContactViewModal = ({ 
  contact, 
  isOpen, 
  onClose 
}) => {
  const { t, i18n } = useTranslation();

  if (!contact) return null;

  return (
    <BaseViewModal
      data={contact}
      isOpen={isOpen}
      onClose={onClose}
      titleKey="contacts"
      maxWidth="max-w-3xl"
    >
      {/* Header with Name and Status */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User size={24} className="text-primary" />
          {contact.name}
        </h2>
        <Badge 
          variant={contact.isRead ? "default" : "destructive"}
          className="text-sm"
        >
          {contact.isRead ? (
            <>
              <CheckCircle2 size={14} className="mr-1" />
              {t('common.read')}
            </>
          ) : (
            <>
              <XCircle size={14} className="mr-1" />
              {t('contacts.unread')}
            </>
          )}
        </Badge>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mail size={20} className="text-primary" />
          {t('contacts.contactInformation')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <User size={14} />
              {t('contacts.contactName')}
            </div>
            <div className="font-medium text-foreground">
              {contact.name || "-"}
            </div>
          </div>

          {/* Email */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <Mail size={14} />
              {t('contacts.contactEmail')}
            </div>
            <div className="font-medium text-foreground">
              <a 
                href={`mailto:${contact.email}`}
                className="text-primary hover:underline"
              >
                {contact.email || "-"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          {t('contacts.contactMessage')}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="font-medium text-foreground whitespace-pre-wrap">
            {contact.message || "-"}
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-primary" />
          {t('contacts.status')}
        </h3>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center gap-2">
            {contact.isRead ? (
              <>
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="font-medium text-foreground">
                  {t('contacts.messageRead')}
                </span>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-red-500" />
                <span className="font-medium text-foreground">
                  {t('contacts.messageUnread')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="border-t pt-6 text-xs text-gray-500 dark:text-gray-400 space-y-2">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            {t('common.createdAt')}:{" "}
            {new Date(contact.createdAt).toLocaleString(i18n.language)}
          </span>
        </div>
        {contact.updatedAt && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>
              {t('common.updatedAt')}:{" "}
              {new Date(contact.updatedAt).toLocaleString(i18n.language)}
            </span>
          </div>
        )}
      </div>
    </BaseViewModal>
  );
};

export default ContactViewModal;