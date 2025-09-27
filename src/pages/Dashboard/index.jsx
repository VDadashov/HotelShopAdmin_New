import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Users, Briefcase, Wrench, Building2, Lightbulb, Layers, Image, Tag, BookOpen } from "lucide-react";
import { useGet } from "@/utils/hooks/useCustomQuery";
import { ENDPOINTS } from "@/utils/constants/Endpoints";
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: products = [] } = useGet("products", ENDPOINTS.products);
  console.log(products);
  
  const { data: galleryItems = [] } = useGet("gallery-items", ENDPOINTS.galleryItem);
  const { data: categories = [] } = useGet("categories", ENDPOINTS.getCategories);
  const { data: contacts = [] } = useGet("contacts", ENDPOINTS.contact);

  // Stat Cards
  const statCards = [
    { title: t('common.products'), count: products.data?.length, icon: <Layers className="w-8 h-8 text-pink-500 mb-2" />, path: "/products" },
    { title: t('common.categories'), count: categories?.data?.length, icon: <Tag className="w-8 h-8 text-yellow-500 mb-2" />, path: "/category" },
    { title: t('common.contacts'), count: contacts.length, icon: <Users className="w-8 h-8 text-gray-500 mb-2" />, path: "/contact" },
  ];

  // Read/Unread breakdown
  const readCount = contacts.filter(c => c.isRead).length;
  const unreadCount = contacts.length - readCount;
  const statusBreakdown = [
    { label: t('common.unread'), color: "bg-red-100 text-red-800", icon: <CheckCircle2 className="w-4 h-4 text-red-500" />, count: unreadCount },
    { label: t('common.read'), color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, count: readCount },
  ];

  // Latest additions
  const latest = (arr, n = 5) => Array.isArray(arr) ? arr.slice(-n).reverse() : [];
  const lang = "az";

  return (
    <div className="w-full mx-auto py-10 px-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-8">{t('dashboard.welcome')}</h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Card 
            key={card.title}
            className="flex flex-col items-center p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105"
            onClick={() => navigate(card.path)}
          >
          <CardContent className="flex flex-col items-center justify-center p-0">
              {card.icon}
              <div className="text-2xl font-bold">{card.count}</div>
              <div className="text-xs text-muted-foreground">{card.title}</div>
          </CardContent>
        </Card>
        ))}
      </div>
      {/* Status breakdown */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">{t('dashboard.contactsBreakdown')}</h2>
        <div className="flex flex-wrap gap-4">
          {statusBreakdown.map(s => (
            <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${s.color} font-medium`}> 
              {s.icon}
              <span>{s.label}:</span>
              <span className="text-base font-bold">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Latest Additions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-3">{t('dashboard.latestProducts')}</h2>
          <ul className="divide-y divide-border bg-card dark:bg-[#232323] rounded-lg shadow">
            {products.data.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 italic">{t('products.noProducts')}</li>
            ) : (
              latest(products.data).map(p => (
                <li key={p.id} className="px-4 py-3 text-sm flex flex-col">
                  <span className="font-medium">{typeof p.title === 'object' ? p.title[lang] : p.title}</span>
                  <span className="text-xs text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">{t('dashboard.latestGalleryItems')}</h2>
          <ul className="divide-y divide-border bg-card dark:bg-[#232323] rounded-lg shadow">
            {galleryItems.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 italic">{t('gallery.noItems')}</li>
            ) : (
              latest(galleryItems).map(g => (
                <li key={g.id} className="px-4 py-3 text-sm flex flex-col">
                  <span className="font-medium">{typeof g.title === 'object' ? g.title[lang] : g.title}</span>
                  <span className="text-xs text-gray-500">{g.createdAt ? new Date(g.createdAt).toLocaleString() : ""}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">{t('dashboard.latestContacts')}</h2>
          <ul className="divide-y divide-border bg-card dark:bg-[#232323] rounded-lg shadow">
            {contacts.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 italic">{t('contacts.noContacts')}</li>
            ) : (
              latest(contacts).map(c => (
                <li key={c.id} className="px-4 py-3 text-sm flex flex-col">
                  <span className="font-medium">{c.name || c.fullName}</span>
                  <span className="text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}</span>
                  <span className={`text-xs font-semibold ${c.isRead ? 'text-green-600' : 'text-red-600'}`}>{c.isRead ? t('common.read') : t('common.unread')}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}