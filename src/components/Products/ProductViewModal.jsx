import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProductViewModal = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const { t, i18n } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full rounded-2xl shadow-2xl bg-card dark:bg-[#232323] p-8 border-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-foreground">
            {t('products.productDetails')}
          </DialogTitle>
        </DialogHeader>
        
        {product && (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              {product.mainImage && (
                <img 
                  src={product.mainImage} 
                  alt="main" 
                  className="w-20 h-20 object-contain rounded-md border" 
                />
              )}
              <div>
                <div className="font-semibold text-lg">
                  {product.title?.[i18n.language] || product.title?.az || ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  ID: {product.id}
                </div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1">{t('products.productDescription')}</div>
              <div className="text-gray-700 text-sm text-foreground">
                {product.description?.[i18n.language] || product.description?.az || ""}
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1">{t('products.imageList')}</div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(product.imageList) && product.imageList.map((img, i) => (
                  <img 
                    key={i} 
                    src={img} 
                    alt="img" 
                    className="w-16 h-16 object-contain rounded border" 
                  />
                ))}
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1">{t('products.detailPdf')}</div>
              {product.detailPdf && (
                <a 
                  href={product.detailPdf} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-blue-600 underline"
                >
                  <Download className="w-5 h-5" /> {t('products.downloadPdf')}
                </a>
              )}
            </div>
            
            <div>
              <div className="font-semibold mb-1">{t('products.productCategory')}</div>
              <div>
                {product.category?.title?.[i18n.language] || 
                 product.category?.title?.az || 
                 product.category?.title || 
                 product.categoryId}
              </div>
            </div>
            
            <div>
              <div className="font-semibold mb-1">{t('products.productCompany')}</div>
              <div>
                {product.company?.title?.[i18n.language] || 
                 product.company?.title?.az || 
                 product.company?.title || 
                 product.companyId}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewModal; 