'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Code } from 'lucide-react';

type SchemaType = 'Article' | 'Product' | 'Organization' | 'LocalBusiness' | 'FAQPage' | 'BreadcrumbList';

const SCHEMA_TEMPLATES: Record<SchemaType, any> = {
    Article: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "",
        "image": "",
        "author": {
            "@type": "Person",
            "name": ""
        },
        "publisher": {
            "@type": "Organization",
            "name": "",
            "logo": {
                "@type": "ImageObject",
                "url": ""
            }
        },
        "datePublished": ""
    },
    Product: {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "",
        "image": "",
        "description": "",
        "sku": "",
        "brand": {
            "@type": "Brand",
            "name": ""
        },
        "offers": {
            "@type": "Offer",
            "url": "",
            "priceCurrency": "USD",
            "price": "",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        }
    },
    Organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "",
        "url": "",
        "logo": "",
        "sameAs": []
    },
    LocalBusiness: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "",
        "image": "",
        "telephone": "",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "",
            "postalCode": "",
            "addressCountry": ""
        }
    },
    FAQPage: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    },
    BreadcrumbList: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    }
};

export default function SchemaGenerator() {
    const [type, setType] = useState<SchemaType>('Article');
    const [data, setData] = useState<any>(JSON.parse(JSON.stringify(SCHEMA_TEMPLATES['Article'])));
    const [copied, setCopied] = useState(false);

    // Form states for simple inputs
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        // Reset form data when type changes
        setFormData({});
        setData(JSON.parse(JSON.stringify(SCHEMA_TEMPLATES[type])));
    }, [type]);

    useEffect(() => {
        // Update JSON based on form data
        const newData = JSON.parse(JSON.stringify(SCHEMA_TEMPLATES[type]));

        if (type === 'Article') {
            newData.headline = formData.headline || '';
            newData.image = formData.image || '';
            newData.author.name = formData.authorName || '';
            newData.publisher.name = formData.publisherName || '';
            newData.publisher.logo.url = formData.publisherLogo || '';
            newData.datePublished = formData.datePublished || new Date().toISOString().split('T')[0];
        } else if (type === 'Product') {
            newData.name = formData.name || '';
            newData.image = formData.image || '';
            newData.description = formData.description || '';
            newData.sku = formData.sku || '';
            newData.brand.name = formData.brand || '';
            newData.offers.price = formData.price || '';
            newData.offers.priceCurrency = formData.currency || 'USD';
        } else if (type === 'Organization') {
            newData.name = formData.name || '';
            newData.url = formData.url || '';
            newData.logo = formData.logo || '';
            if (formData.socials) newData.sameAs = formData.socials.split(',').map((s: string) => s.trim());
        } else if (type === 'LocalBusiness') {
            newData.name = formData.name || '';
            newData.image = formData.image || '';
            newData.telephone = formData.telephone || '';
            newData.address.streetAddress = formData.street || '';
            newData.address.addressLocality = formData.city || '';
            newData.address.postalCode = formData.zip || '';
            newData.address.addressCountry = formData.country || '';
        }

        setData(newData);
    }, [formData, type]);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const Input = ({ label, id, placeholder }: { label: string, id: string, placeholder?: string }) => (
        <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>{label}</label>
            <input
                className="sf-input"
                placeholder={placeholder}
                value={formData[id] || ''}
                onChange={e => setFormData({ ...formData, [id]: e.target.value })}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '13px'
                }}
            />
        </div>
    );

    return (
        <div style={{ marginTop: '24px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Code size={20} color="#3b82f6" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>JSON-LD Schema Generator</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Inputs */}
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Schema Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as SchemaType)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                background: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '13px'
                            }}
                        >
                            {Object.keys(SCHEMA_TEMPLATES).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    {type === 'Article' && (
                        <>
                            <Input label="Headline" id="headline" />
                            <Input label="Author Name" id="authorName" />
                            <Input label="Publisher Name" id="publisherName" />
                            <Input label="Image URL" id="image" />
                        </>
                    )}
                    {type === 'Product' && (
                        <>
                            <Input label="Product Name" id="name" />
                            <Input label="Description" id="description" />
                            <Input label="SKU" id="sku" />
                            <Input label="Price" id="price" />
                            <Input label="Currency" id="currency" placeholder="USD" />
                        </>
                    )}
                    {type === 'Organization' && (
                        <>
                            <Input label="Organization Name" id="name" />
                            <Input label="URL" id="url" />
                            <Input label="Logo URL" id="logo" />
                            <Input label="Social Profiles (comma separated)" id="socials" />
                        </>
                    )}
                    {type === 'LocalBusiness' && (
                        <>
                            <Input label="Business Name" id="name" />
                            <Input label="Telephone" id="telephone" />
                            <Input label="Street Address" id="street" />
                            <Input label="City" id="city" />
                            <Input label="Postal Code" id="zip" />
                        </>
                    )}
                    {(type === 'FAQPage' || type === 'BreadcrumbList') && (
                        <div style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                            Advanced array editing for {type} is coming soon in v2.
                        </div>
                    )}
                </div>

                {/* Output */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        background: '#0f172a',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        height: '100%',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        color: '#a5b4fc'
                    }}>
                        {JSON.stringify(data, null, 2)}
                    </div>
                    <button
                        onClick={handleCopy}
                        style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: copied ? '#22c55e' : 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#fff',
                            transition: 'all 0.2s'
                        }}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
