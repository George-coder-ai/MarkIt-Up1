
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductContent } from '../types';

interface ProductContentContextType {
    productContent: ProductContent;
    updateProductContent: (updates: Partial<ProductContent>) => void;
    savedProducts: ProductContent[];
    saveCurrentProduct: () => void;
}

const initialProductContent: ProductContent = {
    media: [],
    nativeAudio: null,
    translatedText: '',
    productDetails: {
        name: '',
        category: '',
        price: '',
        quantity: '',
    },
};

const ProductContentContext = createContext<ProductContentContextType | undefined>(undefined);

export const ProductContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [productContent, setProductContent] = useState<ProductContent>(initialProductContent);
    const [savedProducts, setSavedProducts] = useState<ProductContent[]>([]);

    const updateProductContent = (updates: Partial<ProductContent>) => {
        setProductContent(prev => ({
            ...prev,
            ...updates,
            productDetails: updates.productDetails
                ? { ...prev.productDetails, ...updates.productDetails }
                : prev.productDetails
        }));
    };

    const saveCurrentProduct = () => {
        if (productContent.productDetails.name) {
            setSavedProducts(prev => [...prev, productContent]);
            // Keep current content for reuse or reset if needed. 
            // For "Create once use everywhere", we keep it.
        }
    };

    return (
        <ProductContentContext.Provider value={{ productContent, updateProductContent, savedProducts, saveCurrentProduct }}>
            {children}
        </ProductContentContext.Provider>
    );
};

export const useProductContent = () => {
    const context = useContext(ProductContentContext);
    if (!context) {
        throw new Error('useProductContent must be used within a ProductContentProvider');
    }
    return context;
};
