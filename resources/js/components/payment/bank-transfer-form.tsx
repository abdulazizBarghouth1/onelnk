import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { Copy, CheckCircle, Upload, FileText, X } from 'lucide-react';

interface BankTransferFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  bankDetails: string;
  currencies?: any[];
  currencySettings?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BankTransferForm({ 
  planId, 
  planPrice,
  couponCode, 
  billingCycle, 
  bankDetails,
  currencies = [],
  currencySettings = {},
  onSuccess, 
  onCancel 
}: BankTransferFormProps) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const [finalPrice, setFinalPrice] = useState(planPrice);
  const [receipt, setReceipt] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // The final price should already be calculated and passed from parent
  useEffect(() => {
    setFinalPrice(planPrice);
  }, [planPrice]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        toast.error(t('Only JPG, PNG, and PDF files are allowed'));
        return;
      }
      if (file.size > maxSize) {
        toast.error(t('File size must not exceed 5MB'));
        return;
      }
      setReceipt(file);
    }
  };

  const handleRemoveFile = () => {
    setReceipt(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyLink = (text: string) => {
    // Fallback clipboard function for HTTP environments
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API for HTTPS
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((resolve, reject) => {
          if (document.execCommand('copy')) {
            textArea.remove();
            resolve();
          } else {
            textArea.remove();
            reject(new Error('Copy failed'));
          }
        });
      }
    };
    copyToClipboard(text)
      .then(() => {
        toast.success(t('Amount copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy amount'));
      });
  };

  const formatDisplayPrice = (amount: number): string => {
    try {
      const settings = {
        defaultCurrency: currencySettings?.defaultCurrency || 'USD',
        decimalFormat: currencySettings?.decimalFormat || '2',
        decimalSeparator: currencySettings?.decimalSeparator || '.',
        thousandsSeparator: currencySettings?.thousandsSeparator || ',',
        floatNumber: currencySettings?.floatNumber !== false,
        currencySymbolSpace: currencySettings?.currencySymbolSpace === true,
        currencySymbolPosition: currencySettings?.currencySymbolPosition || 'before',
      };

      let formattedAmount = Number(amount) || 0;
      if (!settings.floatNumber) {
        formattedAmount = Math.floor(formattedAmount);
      }

      const decimalPlaces = parseInt(settings.decimalFormat) || 2;
      let formattedNumber: string;
      
      if (settings.decimalFormat === '0') {
        formattedNumber = Math.floor(formattedAmount).toString() + settings.decimalSeparator + '00';
      } else {
        const fixedNumber = Number(formattedAmount).toFixed(decimalPlaces);
        const parts = fixedNumber.split('.');
        
        if (settings.thousandsSeparator !== 'none' && settings.thousandsSeparator) {
          parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousandsSeparator);
        }
        
        formattedNumber = parts.join(settings.decimalSeparator);
      }

      let symbol = '$';
      if (currencies && currencies.length > 0) {
        const selectedCurrency = currencies.find((c: any) => c.code === settings.defaultCurrency);
        if (selectedCurrency) {
          symbol = selectedCurrency.symbol;
        }
      } else if (window?.appSettings?.currencySettings?.currencySymbol) {
        symbol = window.appSettings.currencySettings.currencySymbol;
      }

      const space = settings.currencySymbolSpace ? ' ' : '';
      if (settings.currencySymbolPosition === 'before') {
        return `${symbol}${space}${formattedNumber}`;
      } else {
        return `${formattedNumber}${space}${symbol}`;
      }
    } catch (error) {
      return `$${amount}`;
    }
  };

  const handleConfirmPayment = () => {
    if (!receipt) {
      toast.error(t('Please upload your bank transfer receipt'));
      return;
    }

    setProcessing(true);

    const formData = new FormData();
    formData.append('plan_id', planId.toString());
    formData.append('billing_cycle', billingCycle);
    formData.append('coupon_code', couponCode || '');
    formData.append('amount', finalPrice.toString());
    formData.append('receipt', receipt);

    router.post(route('bank.payment'), formData, {
      onSuccess: () => {
        //toast.success(t('Payment request submitted successfully'));
        onSuccess();
      },
      onError: () => {
        toast.error(t('Failed to submit payment request'));
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t('Bank Transfer Details')}</h3>
          <div className="space-y-3 text-sm">
            <div className="whitespace-pre-line">{bankDetails}</div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-medium">{t('Amount')}: {formatDisplayPrice(finalPrice)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(formatDisplayPrice(finalPrice))}
              >
                <Copy className="h-3 w-3 mr-1" />
                {t('Copy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">{t('Important Instructions')}</p>
              <ul className="space-y-1 text-xs">
                <li>• {t('Transfer the exact amount shown above')}</li>
                <li>• {t('Include your order reference in the transfer description')}</li>
                <li>• {t('Your plan will be activated after payment verification')}</li>
                <li>• {t('Verification may take 1-3 business days')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Upload */}
      <div className="space-y-2">
        <Label htmlFor="bank-receipt">{t('Bank Transfer Receipt')} <span className="text-red-500">*</span></Label>
        <Input
          id="bank-receipt"
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {!receipt ? (
          <label
            htmlFor="bank-receipt"
            className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload className="h-5 w-5 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">{t('Click to upload receipt')}</span>
            <span className="text-xs text-gray-400">{t('JPG, PNG, PDF up to 5MB')}</span>
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-sm text-gray-700 truncate">{receipt.name}</span>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('Cancel')}
        </Button>
        <Button 
          onClick={handleConfirmPayment} 
          disabled={processing}
          className="flex-1"
        >
          {processing ? t('Processing...') : t('I have made the payment')}
        </Button>
      </div>
    </div>
  );
}