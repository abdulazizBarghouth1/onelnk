/**
 * Convert an image URL to a base64 string for vCard embedding.
 */
function getImageMimeType(imageUrl: string): string {
  const lower = imageUrl.toLowerCase();
  if (lower.startsWith('data:image/png')) return 'image/png';
  if (lower.startsWith('data:image/gif')) return 'image/gif';
  if (lower.startsWith('data:image/webp')) return 'image/webp';
  if (lower.startsWith('data:image/jpg') || lower.startsWith('data:image/jpeg')) return 'image/jpeg';
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.gif')) return 'image/gif';
  if (lower.includes('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Normalize local storage image paths to a fetchable public URL.
 */
function normalizePhotoUrl(imageUrl: string): string {
  const cleanUrl = imageUrl.trim();

  if (cleanUrl.startsWith('local:media/')) {
    const mediaPath = cleanUrl.substring(6);
    const baseUrl = (window as any).page?.props?.base_url || window.location.origin;
    return `${baseUrl}/storage/${mediaPath}`;
  }

  if (cleanUrl.startsWith('/storage/')) {
    const baseUrl = (window as any).page?.props?.base_url || window.location.origin;
    return `${baseUrl}${cleanUrl}`;
  }

  return cleanUrl;
}

/**
 * Convert an image URL to a base64 string for vCard embedding.
 */
async function getEmbeddedPhotoLine(imageUrl: string): Promise<string> {
  if (!imageUrl) {
    return '';
  }

  // Already embedded as a data URL.
  if (imageUrl.startsWith('data:image/')) {
    const commaIndex = imageUrl.indexOf(',');
    if (commaIndex !== -1) {
      const mimeType = imageUrl.substring(5, imageUrl.indexOf(';'));
      const base64Data = imageUrl.substring(commaIndex + 1);
      return `PHOTO;ENCODING=b;TYPE=${mimeType.split('/')[1].toUpperCase()}:${base64Data}`;
    }
    return '';
  }

  const normalizedUrl = normalizePhotoUrl(imageUrl);

  try {
    const response = await fetch(normalizedUrl);
    if (!response.ok) {
      return `PHOTO;VALUE=URI:${normalizedUrl}`;
    }

    const blob = await response.blob();
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || '');
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(blob);
    });

    if (!base64Data) {
      return `PHOTO;VALUE=URI:${normalizedUrl}`;
    }

    const mimeType = blob.type || getImageMimeType(normalizedUrl);
    const type = mimeType.split('/')[1].toUpperCase();
    return `PHOTO;ENCODING=b;TYPE=${type}:${base64Data}`;
  } catch {
    return `PHOTO;VALUE=URI:${normalizedUrl}`;
  }
}

/**
 * Generate a VCF file from business data
 */
export async function generateVCF(businessData: any): Promise<string> {
  const { name, title, email, phone, website, location, photo, profile_image, logo, avatar } = businessData;
  
  // Format data for VCF
  const formattedName = name || '';
  const formattedTitle = title || '';
  const formattedEmail = email || '';
  const formattedPhone = (phone || '').replace(/[^\d+]/g, '');
  const formattedWebsite = website || '';
  const formattedAddress = location || '';
  const formattedPhoto = photo || profile_image || logo || avatar || '';
  
  // Build VCF content
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${formattedName}`];
  
  if (formattedTitle) {
    lines.push(`TITLE:${formattedTitle}`);
  }
  
  if (formattedEmail) {
    lines.push(`EMAIL;TYPE=WORK:${formattedEmail}`);
  }
  
  if (formattedPhone) {
    lines.push(`TEL;TYPE=WORK:${formattedPhone}`);
  }
  
  if (formattedWebsite) {
    lines.push(`URL:${formattedWebsite}`);
  }
  
  if (formattedAddress) {
    lines.push(`ADR;TYPE=WORK:;;${formattedAddress}`);
  }

  if (formattedPhoto) {
    lines.push(await getEmbeddedPhotoLine(formattedPhoto));
  }
  
  lines.push('END:VCARD');
  
  return lines.filter(Boolean).join('\n');
}

/**
 * Download VCF file
 */
export async function downloadVCF(businessData: any): Promise<void> {
  const vcfContent = await generateVCF(businessData);
  const fileName = `${businessData.name || 'contact'}.vcf`;

  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
