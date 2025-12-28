'use client';

import generatePDF from 'react-to-pdf';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer';
import { Html as ReactPDFHtml } from 'react-pdf-html';

// Types for our PDF generation system
export interface PDFGenerationOptions {
  method: 'react-to-pdf' | 'html2canvas' | 'react-pdf';
  resolution?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: 'low' | 'medium' | 'high';
}

export interface ComponentRef {
  name: string;
  ref: React.RefObject<HTMLDivElement>;
}

// Reusable PDF generation utilities
export class PDFGenerator {
  private static async waitForImages(timeout: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('img');
      let loadedCount = 0;

      if (images.length === 0) {
        resolve();
        return;
      }

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === images.length) {
              resolve();
            }
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount === images.length) {
              resolve();
            }
          });
        }
      });

      setTimeout(() => {
        if (loadedCount >= images.length) {
          resolve();
        }
      }, timeout);
    });
  }

  private static async waitForImagesInElement(element: HTMLElement, timeout: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const images = element.querySelectorAll('img');
      let loadedCount = 0;

      if (images.length === 0) {
        resolve();
        return;
      }

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === images.length) {
              resolve();
            }
          });
          img.addEventListener('error', () => {
            loadedCount++;
            if (loadedCount === images.length) {
              resolve();
            }
          });
        }
      });

      setTimeout(() => {
        if (loadedCount >= images.length) {
          resolve();
        }
      }, timeout);
    });
  }

  // Method 1: react-to-pdf (enhanced pagination)
  static async generateWithReactToPDF(
    element: React.RefObject<HTMLDivElement>,
    filename: string,
    options: PDFGenerationOptions = { method: 'react-to-pdf' }
  ): Promise<void> {
    if (!element.current) return;

    await this.waitForImages();

    // Pre-process element for better pagination
    const originalElement = element.current;
    const originalStyles = {
      maxWidth: originalElement.style.maxWidth,
      width: originalElement.style.width,
      margin: originalElement.style.margin,
      padding: originalElement.style.padding,
      boxSizing: originalElement.style.boxSizing
    };

    // Apply print-optimized styles
    originalElement.style.maxWidth = 'none';
    originalElement.style.width = '100%';
    originalElement.style.margin = '0';
    originalElement.style.padding = '20px';
    originalElement.style.boxSizing = 'border-box';

    // Add CSS for better page breaking
    const printStyles = document.createElement('style');
    printStyles.textContent = `
      @media print {
        .page-break-before { page-break-before: always; }
        .page-break-after { page-break-after: always; }
        .avoid-break { page-break-inside: avoid; }
        .page-break-inside-avoid { page-break-inside: avoid; }

        /* Force page breaks before major sections */
        h1, h2, h3 { page-break-before: always; }
        h1:first-child, h2:first-child, h3:first-child { page-break-before: avoid; }

        /* Avoid breaking inside important content */
        .alert, .card, .panel { page-break-inside: avoid; }
        ul, ol { page-break-inside: avoid; }
        li { page-break-inside: avoid; }
        .flex { page-break-inside: avoid; }
        .grid { page-break-inside: avoid; }

        /* Better image handling */
        img { max-width: 100%; height: auto; page-break-inside: avoid; }

        /* Enhanced print styles */
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Force visibility of all elements */
        * {
          opacity: 1 !important;
          visibility: visible !important;
        }
      }

      /* Additional print optimizations */
      @page {
        margin: 20mm;
        size: A4;
      }
    `;
    document.head.appendChild(printStyles);

    // Use our own html2canvas-pro implementation instead of react-to-pdf's internal html2canvas
    try {
      console.log('Starting html2canvas capture for element:', originalElement);

      const canvas = await html2canvas(originalElement, {
        scale: options.quality === 'high' ? 3 : options.quality === 'low' ? 1.5 : 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: true, // Enable logging to debug issues
        width: originalElement.scrollWidth,
        height: originalElement.scrollHeight,
        // html2canvas-pro specific options for better color support
        imageTimeout: 15000,
        removeContainer: false,
        foreignObjectRendering: true
      });

      console.log('Canvas created successfully:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png', 1.0);

      // Create PDF using jsPDF
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle pagination for large content
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const yOffset = page * pdfHeight;
        const remainingHeight = Math.min(pdfHeight, imgHeight - yOffset);

        pdf.addImage(
          imgData,
          'PNG',
          0,
          -yOffset,
          imgWidth,
          remainingHeight,
          undefined,
          'FAST'
        );
      }

      pdf.save(filename);
    } catch (error: any) {
      console.error('Custom react-to-pdf generation failed:', error);

      // Provide more detailed error information
      let errorMessage = 'Unknown error occurred during PDF generation';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = `Error object: ${JSON.stringify(error)}`;
      }

      throw new Error(`PDF generation failed: ${errorMessage}`);
    } finally {
      // Always restore original styles and remove print styles
      Object.assign(originalElement.style, originalStyles);
      if (printStyles.parentNode) {
        document.head.removeChild(printStyles);
      }
    }
  }

  // Method 2: html2canvas + jsPDF (Perfect Visual Fidelity - DOM Screenshot)
  static async generateWithHtml2Canvas(
    element: React.RefObject<HTMLDivElement>,
    filename: string,
    options: PDFGenerationOptions = { method: 'html2canvas' }
  ): Promise<void> {
    if (!element.current) return;

    let originalStyles: any = {};

    try {
      // Enhanced waiting for all assets
      await this.waitForImagesInElement(element.current);
      await this.waitForFonts();
      await this.waitForAnimations();

      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Pre-process element for better capture
      const originalElement = element.current;
      originalStyles = {
        transform: originalElement.style.transform,
        transition: originalElement.style.transition,
        filter: originalElement.style.filter,
        opacity: originalElement.style.opacity,
        visibility: originalElement.style.visibility
      };

      // Temporarily remove any transforms/filters that might interfere
      originalElement.style.transform = 'none';
      originalElement.style.transition = 'none';
      originalElement.style.filter = 'none';
      originalElement.style.opacity = '1';
      originalElement.style.visibility = 'visible';

      // Force layout recalculation
      void originalElement.offsetWidth;
      void originalElement.offsetHeight;

      // Get precise element dimensions
      const elementRect = originalElement.getBoundingClientRect();
      const elementHeight = originalElement.scrollHeight;
      const elementWidth = originalElement.scrollWidth;

      // Ultra-high quality settings for crystal clear images
      const scale = options.quality === 'high' ? 4 : options.quality === 'low' ? 2 : 3;
      const dpi = options.quality === 'high' ? 400 : options.quality === 'low' ? 200 : 300;

      // Pre-load all images before capture
      await this.preloadAllImages(originalElement);

      // Enhanced html2canvas options for crystal clear images
      const canvas = await new Promise<HTMLCanvasElement>((resolve, reject) => {
        html2canvas(originalElement, {
          scale: scale,
          useCORS: true,
          allowTaint: true, // Allow cross-origin for better image handling
          backgroundColor: '#ffffff', // Force white background
          logging: false,
          width: elementWidth,
          height: elementHeight,
          // Enhanced options for perfect image quality
          imageTimeout: 45000, // Extra long timeout for all images
          removeContainer: false,
          foreignObjectRendering: true, // Better SVG support
          // Ensure all styles are computed and elements are visible
          onclone: (clonedDoc) => {
            // Force all elements to be fully visible and styled
            const allElements = clonedDoc.querySelectorAll('*');

            allElements.forEach((el: Element) => {
              const htmlEl = el as HTMLElement;

              // Get computed styles from original document
              const originalEl = element.current?.querySelector(`[data-reactid="${htmlEl.getAttribute('data-reactid')}"]`) ||
                element.current?.querySelector(`#${htmlEl.id}`) ||
                htmlEl;

              let computedStyles: CSSStyleDeclaration;
              try {
                computedStyles = window.getComputedStyle(originalEl as Element);
              } catch {
                computedStyles = window.getComputedStyle(htmlEl);
              }

              // Force visibility and remove any opacity/filters that could cause greying
              htmlEl.style.setProperty('opacity', '1', 'important');
              htmlEl.style.setProperty('visibility', 'visible', 'important');
              htmlEl.style.display = computedStyles.display || 'block';
              htmlEl.style.setProperty('filter', 'none', 'important');
              htmlEl.style.setProperty('backdrop-filter', 'none', 'important');
              htmlEl.style.setProperty('transform', 'none', 'important');
              htmlEl.style.setProperty('transition', 'none', 'important');

              // Ensure background is properly set
              if (computedStyles.backgroundColor && computedStyles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                htmlEl.style.backgroundColor = computedStyles.backgroundColor;
              } else if (htmlEl.tagName === 'BODY' || htmlEl.tagName === 'HTML') {
                htmlEl.style.backgroundColor = '#ffffff';
              }

              // Handle images specifically (including avatars) - AGGRESSIVE IMAGE FIX
              if (htmlEl.tagName === 'IMG') {
                const img = htmlEl as HTMLImageElement;

                // Force maximum visibility
                img.style.setProperty('opacity', '1', 'important');
                img.style.setProperty('visibility', 'visible', 'important');
                img.style.setProperty('filter', 'none', 'important');
                img.style.setProperty('backdrop-filter', 'none', 'important');
                img.style.display = 'block';
                img.style.imageRendering = 'auto'; // Better quality

                // Ensure proper dimensions
                if (img.naturalWidth && img.naturalHeight) {
                  img.style.width = img.naturalWidth + 'px';
                  img.style.height = img.naturalHeight + 'px';
                  img.style.maxWidth = 'none';
                  img.style.maxHeight = 'none';
                } else if (computedStyles.width && computedStyles.height) {
                  img.style.width = computedStyles.width;
                  img.style.height = computedStyles.height;
                }

                // Handle loading states - be more aggressive with fallbacks
                if (!img.complete || img.naturalWidth === 0) {
                  // Hide broken images immediately
                  img.style.display = 'none';
                  img.style.visibility = 'hidden';

                  // Find and show fallback aggressively
                  const container = htmlEl.parentElement;
                  if (container) {
                    const fallback = container.querySelector('[class*="fallback"], [class*="Fallback"], [data-fallback]');
                    if (fallback) {
                      const fallbackEl = fallback as HTMLElement;
                      fallbackEl.style.display = 'flex !important';
                      fallbackEl.style.visibility = 'visible !important';
                      fallbackEl.style.opacity = '1 !important';
                      fallbackEl.style.alignItems = 'center';
                      fallbackEl.style.justifyContent = 'center';
                      fallbackEl.style.backgroundColor = computedStyles.backgroundColor || '#2563eb';
                      fallbackEl.style.color = '#ffffff';
                      fallbackEl.style.borderRadius = '50%';
                      fallbackEl.style.fontWeight = 'bold';
                    }
                  }
                } else {
                  // Image loaded successfully - ensure it's visible
                  img.style.display = 'block';
                  img.style.visibility = 'visible';
                }

                // Remove any lazy loading attributes that might interfere
                img.removeAttribute('loading');
                img.removeAttribute('lazy');
              }

              // Handle SVG elements (including Lucide React icons)
              if (htmlEl.tagName === 'SVG' || htmlEl.closest('svg')) {
                const svgEl = htmlEl.tagName === 'SVG' ? htmlEl : htmlEl.closest('svg') as SVGElement;

                // Aggressive SVG visibility
                svgEl.style.setProperty('opacity', '1', 'important');
                svgEl.style.setProperty('visibility', 'visible', 'important');
                svgEl.style.setProperty('filter', 'none', 'important');
                svgEl.style.setProperty('backdrop-filter', 'none', 'important');
                svgEl.style.display = computedStyles.display || 'inline-block';

                // Ensure SVG has explicit dimensions
                if (!svgEl.style.width && computedStyles.width) {
                  svgEl.style.width = computedStyles.width;
                }
                if (!svgEl.style.height && computedStyles.height) {
                  svgEl.style.height = computedStyles.height;
                }

                // Set default dimensions if missing
                if (!svgEl.style.width) svgEl.style.width = '1em';
                if (!svgEl.style.height) svgEl.style.height = '1em';

                // Ensure SVG viewport is set
                if (!svgEl.getAttribute('viewBox') && !svgEl.getAttribute('width')) {
                  svgEl.setAttribute('width', '24');
                  svgEl.setAttribute('height', '24');
                  svgEl.setAttribute('viewBox', '0 0 24 24');
                }

                // Handle fill and stroke for icons
                const paths = svgEl.querySelectorAll('path, circle, rect, line, polyline, polygon');
                paths.forEach((path) => {
                  const pathEl = path as SVGElement;
                  pathEl.style.setProperty('opacity', '1', 'important');
                  pathEl.style.setProperty('visibility', 'visible', 'important');
                  pathEl.style.setProperty('fill', computedStyles.color || 'currentColor', 'important');
                  pathEl.style.setProperty('stroke', computedStyles.color || 'currentColor', 'important');
                });

              }

              // Handle icon containers (Lucide React wrapper divs)
              if (htmlEl.classList.contains('lucide') || htmlEl.classList.contains('lucide-react') ||
                htmlEl.querySelector('svg')) {
                htmlEl.style.setProperty('opacity', '1', 'important');
                htmlEl.style.setProperty('visibility', 'visible', 'important');
                htmlEl.style.display = 'inline-block';
                htmlEl.style.verticalAlign = 'middle';
              }

              // Handle canvas elements (charts)
              if (htmlEl.tagName === 'CANVAS') {
                const canvasEl = htmlEl as HTMLCanvasElement;
                canvasEl.style.setProperty('opacity', '1', 'important');
                canvasEl.style.setProperty('visibility', 'visible', 'important');
                canvasEl.style.setProperty('filter', 'none', 'important');
              }

              // Handle links and external links
              if (htmlEl.tagName === 'A') {
                const link = htmlEl as HTMLAnchorElement;
                link.style.setProperty('opacity', '1', 'important');
                link.style.setProperty('visibility', 'visible', 'important');
                link.style.textDecoration = computedStyles.textDecoration || 'none';
                link.style.color = computedStyles.color || 'inherit';
              }

              // Handle elements with background opacity (like bg-white/70)
              if (computedStyles.backgroundColor && computedStyles.backgroundColor.includes('rgba')) {
                // Convert rgba to solid color for PDF compatibility
                const rgbaMatch = computedStyles.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
                if (rgbaMatch) {
                  const [_, r, g, b] = rgbaMatch;
                  htmlEl.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
                }
              }


              // Handle Tailwind opacity classes
              if (htmlEl.classList.contains('bg-white/70') || htmlEl.classList.contains('bg-white/80') ||
                htmlEl.classList.contains('bg-gray-50/50') || htmlEl.classList.toString().includes('/')) {
                // Remove opacity from background for PDF compatibility
                htmlEl.style.backgroundColor = '#ffffff';
              }

              // Handle flexbox and complex layouts
              if (computedStyles.display === 'flex' || htmlEl.classList.contains('flex')) {
                htmlEl.style.display = 'flex';
                htmlEl.style.flexDirection = computedStyles.flexDirection || 'row';
                htmlEl.style.justifyContent = computedStyles.justifyContent || 'flex-start';
                htmlEl.style.alignItems = computedStyles.alignItems || 'stretch';
                htmlEl.style.flexWrap = computedStyles.flexWrap || 'nowrap';
              }

              // Handle rounded corners and shadows
              if (computedStyles.borderRadius) {
                htmlEl.style.borderRadius = computedStyles.borderRadius;
              }
              if (computedStyles.boxShadow && computedStyles.boxShadow !== 'none') {
                // Simplify shadows for PDF compatibility
                htmlEl.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }

              // Handle text elements
              if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'DIV'].includes(htmlEl.tagName)) {
                htmlEl.style.setProperty('opacity', '1', 'important');
                htmlEl.style.setProperty('visibility', 'visible', 'important');
                htmlEl.style.color = computedStyles.color || 'inherit';
                htmlEl.style.fontSize = computedStyles.fontSize || 'inherit';
                htmlEl.style.fontWeight = computedStyles.fontWeight || 'normal';
                htmlEl.style.fontFamily = computedStyles.fontFamily || 'inherit';
                htmlEl.style.lineHeight = computedStyles.lineHeight || 'normal';
              }

              // Handle Avatar components and fallbacks
              if (htmlEl.classList.contains('avatar') || htmlEl.classList.contains('Avatar') ||
                htmlEl.closest('[class*="avatar"], [class*="Avatar"]')) {
                htmlEl.style.setProperty('opacity', '1', 'important');
                htmlEl.style.setProperty('visibility', 'visible', 'important');
                htmlEl.style.display = 'flex';
                htmlEl.style.alignItems = 'center';
                htmlEl.style.justifyContent = 'center';
                // Ensure proper sizing
                if (computedStyles.width) htmlEl.style.width = computedStyles.width;
                if (computedStyles.height) htmlEl.style.height = computedStyles.height;
              }

              // Handle fallback elements (for missing images)
              if (htmlEl.classList.contains('fallback') || htmlEl.classList.contains('Fallback') ||
                htmlEl.getAttribute('data-fallback') === 'true') {
                htmlEl.style.setProperty('opacity', '1', 'important');
                htmlEl.style.setProperty('visibility', 'visible', 'important');
                htmlEl.style.display = 'flex';
                htmlEl.style.alignItems = 'center';
                htmlEl.style.justifyContent = 'center';
                // Ensure fallback text is visible
                htmlEl.style.color = computedStyles.color || '#ffffff';
                htmlEl.style.backgroundColor = computedStyles.backgroundColor || '#2563eb';
              }

              // Handle ring/border utilities
              if (htmlEl.classList.contains('ring-2') || htmlEl.classList.toString().includes('ring-')) {
                htmlEl.style.border = `2px solid ${computedStyles.borderColor || '#e5e7eb'}`;
                htmlEl.style.borderRadius = computedStyles.borderRadius || '9999px';
              }

              // Handle gradient backgrounds
              if (computedStyles.backgroundImage && computedStyles.backgroundImage.includes('gradient')) {
                // Simplify gradients to solid colors for PDF compatibility
                if (computedStyles.backgroundImage.includes('blue')) {
                  htmlEl.style.backgroundColor = '#2563eb';
                } else if (computedStyles.backgroundImage.includes('gray') || computedStyles.backgroundImage.includes('grey')) {
                  htmlEl.style.backgroundColor = '#6b7280';
                } else {
                  htmlEl.style.backgroundColor = '#ffffff';
                }
                htmlEl.style.backgroundImage = 'none';
              }

              // Force layout by accessing offset properties
              void htmlEl.offsetWidth;
              void htmlEl.offsetHeight;
            });

            // Additional pass to ensure all styles are applied
            setTimeout(() => {
              allElements.forEach((el: Element) => {
                const htmlEl = el as HTMLElement;
                void htmlEl.offsetWidth; // Force layout recalculation
              });

              // Small delay to ensure everything is ready
              setTimeout(() => {
                // Force layout recalculation
                allElements.forEach((el: Element) => {
                  const htmlEl = el as HTMLElement;
                  void htmlEl.offsetWidth;
                });
                // The canvas will be created after this callback
              }, 200);
            }, 100);
          }
        }).then(resolve).catch(reject);
      });

      const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality

      // Calculate pagination with high precision
      const canvasAspectRatio = canvas.height / canvas.width;
      const pageHeightPx = pdfHeight * (dpi / 25.4); // Convert mm to pixels at target DPI
      const pageWidthPx = pdfWidth * (dpi / 25.4);

      const totalPages = Math.ceil(canvas.height / pageHeightPx);

      // Add pages with perfect image placement
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const yOffset = page * pageHeightPx;
        const remainingHeight = Math.min(pageHeightPx, canvas.height - yOffset);

        // Perfect image positioning and sizing
        pdf.addImage(
          imgData,
          'PNG',
          0,                          // x position (full width)
          -yOffset * (pdfHeight / pageHeightPx), // y position (converted to PDF units)
          pdfWidth,                   // width (full page width)
          (remainingHeight / pageHeightPx) * pdfHeight, // height (proportional)
          undefined,                  // alias
          'FAST'                      // compression for speed
        );
      }

      pdf.save(filename);
    } catch (error: any) {
      console.error('html2canvas PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      // Always restore original styles
      if (element.current && originalStyles) {
        Object.assign(element.current.style, originalStyles);
      }
    }
  }

  // Helper: Wait for fonts to load
  private static async waitForFonts(timeout: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      if ('fonts' in document) {
        document.fonts.ready.then(() => resolve());
      } else {
        // Fallback for older browsers
        setTimeout(resolve, 500);
      }
      setTimeout(resolve, timeout); // Safety timeout
    });
  }

  // Helper: Wait for animations to complete
  private static async waitForAnimations(timeout: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      // Wait for any CSS animations to complete
      const animatedElements = document.querySelectorAll('*[style*="animation"], *[class*="animate"]');
      if (animatedElements.length === 0) {
        resolve();
        return;
      }

      // Simple timeout - in practice you might want more sophisticated animation detection
      setTimeout(resolve, timeout);
    });
  }

  // Helper: Pre-load all images to ensure they're ready for capture
  private static async preloadAllImages(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll('img');
    if (images.length === 0) return;

    const imagePromises: Promise<void>[] = [];

    images.forEach((img) => {
      const promise = new Promise<void>((resolve) => {
        // If image is already loaded successfully, resolve immediately
        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve();
          return;
        }

        // If no src, skip
        if (!img.src || img.src === '') {
          resolve();
          return;
        }

        let resolved = false;

        const resolveOnce = () => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        // Set up event listeners
        img.onload = resolveOnce;
        img.onerror = () => {
          console.warn(`Image failed to load: ${img.src}`);
          resolveOnce(); // Still resolve to not block PDF generation
        };

        // If already complete but failed, resolve
        if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
          console.warn(`Image failed to load: ${img.src}`);
          resolveOnce();
          return;
        }

        // Timeout after 15 seconds
        setTimeout(() => {
          if (!resolved) {
            console.warn(`Image load timeout: ${img.src}`);
            resolveOnce();
          }
        }, 15000);

        // Force reload by setting src again (helps with cached images)
        const currentSrc = img.src;
        img.src = '';
        img.src = currentSrc;
      });

      imagePromises.push(promise);
    });

    // Wait for all images to load (or fail)
    await Promise.all(imagePromises);

    // Additional delay to ensure everything is stable
    await new Promise(resolve => setTimeout(resolve, 500));
  }



  // Method 3: @react-pdf/renderer with react-pdf-html for perfect fidelity
  static createReactPDFDocument(element: HTMLElement, title: string) {
    // Extract HTML content with computed styles
    const extractStyledHTML = (el: HTMLElement): string => {
      // Get computed styles and convert to inline styles
      const computedStyle = window.getComputedStyle(el);
      const inlineStyles: { [key: string]: string } = {};

      // Font properties
      if (computedStyle.fontSize) inlineStyles.fontSize = computedStyle.fontSize;
      if (computedStyle.fontWeight && computedStyle.fontWeight !== 'normal') inlineStyles.fontWeight = computedStyle.fontWeight;
      if (computedStyle.fontStyle === 'italic') inlineStyles.fontStyle = 'italic';
      if (computedStyle.textAlign !== 'start') inlineStyles.textAlign = computedStyle.textAlign;

      // Color properties
      if (computedStyle.color) inlineStyles.color = computedStyle.color;
      if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        inlineStyles.backgroundColor = computedStyle.backgroundColor;
      }

      // Spacing properties
      if (computedStyle.marginTop && computedStyle.marginTop !== '0px') inlineStyles.marginTop = computedStyle.marginTop;
      if (computedStyle.marginBottom && computedStyle.marginBottom !== '0px') inlineStyles.marginBottom = computedStyle.marginBottom;
      if (computedStyle.marginLeft && computedStyle.marginLeft !== '0px') inlineStyles.marginLeft = computedStyle.marginLeft;
      if (computedStyle.marginRight && computedStyle.marginRight !== '0px') inlineStyles.marginRight = computedStyle.marginRight;
      if (computedStyle.paddingTop && computedStyle.paddingTop !== '0px') inlineStyles.paddingTop = computedStyle.paddingTop;
      if (computedStyle.paddingBottom && computedStyle.paddingBottom !== '0px') inlineStyles.paddingBottom = computedStyle.paddingBottom;
      if (computedStyle.paddingLeft && computedStyle.paddingLeft !== '0px') inlineStyles.paddingLeft = computedStyle.paddingLeft;
      if (computedStyle.paddingRight && computedStyle.paddingRight !== '0px') inlineStyles.paddingRight = computedStyle.paddingRight;

      // Border properties
      if (computedStyle.borderTopWidth && computedStyle.borderTopWidth !== '0px') {
        inlineStyles.borderTop = `${computedStyle.borderTopWidth} ${computedStyle.borderTopStyle} ${computedStyle.borderTopColor}`;
      }

      // Size properties
      if (computedStyle.width && computedStyle.width !== 'auto') inlineStyles.width = computedStyle.width;
      if (computedStyle.height && computedStyle.height !== 'auto') inlineStyles.height = computedStyle.height;

      // Flexbox properties
      if (computedStyle.display === 'flex') {
        inlineStyles.display = 'flex';
        if (computedStyle.flexDirection) inlineStyles.flexDirection = computedStyle.flexDirection;
        if (computedStyle.justifyContent) inlineStyles.justifyContent = computedStyle.justifyContent;
        if (computedStyle.alignItems) inlineStyles.alignItems = computedStyle.alignItems;
      }

      // Convert styles object to inline style string
      const styleString = Object.entries(inlineStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
        .join(';');

      // Clone element and apply inline styles
      const clonedElement = el.cloneNode(true) as HTMLElement;

      // Remove problematic elements
      const scriptsAndStyles = clonedElement.querySelectorAll('script, style, link');
      scriptsAndStyles.forEach(el => el.remove());

      // Apply inline styles
      if (styleString) {
        clonedElement.style.cssText = styleString;
      }

      // Process children recursively
      Array.from(clonedElement.children).forEach(child => {
        const childElement = child as HTMLElement;
        const childHTML = extractStyledHTML(childElement);
        childElement.outerHTML = childHTML;
      });

      return clonedElement.outerHTML;
    };

    // Get the styled HTML
    const styledHTML = extractStyledHTML(element);

    // Inject Tailwind CSS
    const tailwindCSS = `
      <style>
        .text-blue-600 { color: #2563eb; }
        .text-blue-800 { color: #1e40af; }
        .font-bold { font-weight: bold; }
        .underline { text-decoration: underline; }
        .text-lg { font-size: 18px; }
        .text-sm { font-size: 14px; }
        .text-xs { font-size: 12px; }
        .mb-4 { margin-bottom: 16px; }
        .mb-6 { margin-bottom: 24px; }
        .mb-8 { margin-bottom: 32px; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }
        .mt-8 { margin-top: 32px; }
        .p-4 { padding: 16px; }
        .p-6 { padding: 24px; }
        .p-8 { padding: 32px; }
        .bg-white { background-color: #ffffff; }
        .bg-gray-50 { background-color: #f9fafb; }
        .border { border: 1px solid #d1d5db; }
        .border-gray-200 { border-color: #e5e7eb; }
        .rounded { border-radius: 4px; }
        .rounded-lg { border-radius: 8px; }
        .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .flex { display: flex; }
        .grid { display: grid; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .space-y-1 > * + * { margin-top: 4px; }
        .space-y-2 > * + * { margin-top: 8px; }
        .space-x-2 > * + * { margin-left: 8px; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        .leading-tight { line-height: 1.25; }
        .leading-normal { line-height: 1.5; }
        .whitespace-nowrap { white-space: nowrap; }
        .break-words { word-wrap: break-word; }
        .overflow-wrap-anywhere { overflow-wrap: anywhere; }
      </style>
    `;

    const htmlContent = tailwindCSS + styledHTML;

    const ReactPDFDocument = () => (
      <Document>
        <Page size="A4" style={{ padding: 20, backgroundColor: '#ffffff' }}>
          <View style={{ flex: 1 }}>
            <ReactPDFHtml stylesheet={[]} resetStyles>{htmlContent}</ReactPDFHtml>
          </View>
        </Page>
      </Document>
    );

    ReactPDFDocument.displayName = 'ReactPDFDocument';

    return ReactPDFDocument;
  }

  static async generateWithReactPDF(
    element: React.RefObject<HTMLDivElement>,
    filename: string,
    title: string,
    options: PDFGenerationOptions = { method: 'react-pdf' }
  ): Promise<void> {
    if (!element.current) return;

    try {
      // Clone element to avoid modifying original
      const clonedElement = element.current.cloneNode(true) as HTMLElement;

      // Remove problematic elements but keep styles for react-pdf-html
      const scripts = clonedElement.querySelectorAll('script');
      scripts.forEach(el => el.remove());

      const MyDocument = this.createReactPDFDocument(clonedElement, title);
      const blob = await pdf(<MyDocument />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('React-PDF generation failed:', error);
      throw error;
    }
  }

  // Master method that handles all three approaches for full reports
  static async generateFullReport(
    components: ComponentRef[],
    filename: string,
    options: PDFGenerationOptions
  ): Promise<void> {
    switch (options.method) {
      case 'react-to-pdf': {
        // For react-to-pdf, combine all components
        const container = document.createElement('div');
        container.style.width = '794px';
        container.style.margin = '0 auto';
        container.style.backgroundColor = '#ffffff';

        // Add all components to container
        components.forEach(({ ref }) => {
          if (ref.current) {
            const clonedComponent = ref.current.cloneNode(true) as HTMLElement;
            container.appendChild(clonedComponent);
          }
        });

        // Add to DOM temporarily for processing
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        try {
          await this.generateWithReactToPDF({ current: container }, filename, options);
        } finally {
          // Clean up
          document.body.removeChild(container);
        }
        break;
      }

      case 'html2canvas': {
        // For html2canvas, process each component individually and combine
        const pdf = new jsPDF({
          orientation: options.orientation || 'portrait',
          unit: 'mm',
          format: options.format || 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < components.length; i++) {
          const { ref } = components[i];
          if (!ref.current) continue;

          if (i > 0) {
            pdf.addPage();
          }

          // Wait for images in this specific component
          await this.waitForImagesInElement(ref.current);

          const canvas = await html2canvas(ref.current, {
            scale: options.quality === 'high' ? 2 : options.quality === 'low' ? 1 : 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: ref.current.scrollWidth,
            height: ref.current.scrollHeight
          });

          const imgData = canvas.toDataURL('image/png');

          // Calculate dimensions to fit A4 page
          const aspectRatio = canvas.height / canvas.width;
          const imgWidth = pdfWidth;
          const imgHeight = imgWidth * aspectRatio;

          // If image is taller than page height, scale it down
          if (imgHeight > pdfHeight) {
            const scaledHeight = pdfHeight;
            const scaledWidth = scaledHeight / aspectRatio;
            pdf.addImage(imgData, 'PNG', (pdfWidth - scaledWidth) / 2, 0, scaledWidth, scaledHeight);
          } else {
            // Center the image horizontally
            const xOffset = (pdfWidth - imgWidth) / 2;
            pdf.addImage(imgData, 'PNG', xOffset, 0, imgWidth, imgHeight);
          }
        }

        pdf.save(filename);
        break;
      }

      case 'react-pdf': {
        // For react-pdf, combine all components
        const reactPdfContainer = document.createElement('div');
        reactPdfContainer.style.width = '794px';
        reactPdfContainer.style.margin = '0 auto';
        reactPdfContainer.style.backgroundColor = '#ffffff';

        // Add all components to container
        components.forEach(({ ref }) => {
          if (ref.current) {
            const clonedComponent = ref.current.cloneNode(true) as HTMLElement;
            reactPdfContainer.appendChild(clonedComponent);
          }
        });

        // Add to DOM temporarily for processing
        reactPdfContainer.style.position = 'absolute';
        reactPdfContainer.style.left = '-9999px';
        reactPdfContainer.style.top = '0';
        document.body.appendChild(reactPdfContainer);

        try {
          await this.generateWithReactPDF({ current: reactPdfContainer }, filename, 'Full ESG Report', options);
        } finally {
          // Clean up
          document.body.removeChild(reactPdfContainer);
        }
        break;
      }
    }
  }
}

// Configuration for different report types
export const REPORT_CONFIGS = {
  ESG_REPORT: {
    name: 'ESG Report',
    components: [
      'cover', 'toc', 'intro1', 'intro2', 'intro3', 'internal1', 'internal2', 'internal3',
      'external', 'esg8', 'industrialization', 'governance1', 'governance2', 'esg9',
      'esg10', 'esg11', 'esg12', 'esg13', 'endnotes1', 'endnotes2', 'appendix', 'endpage'
    ]
  }
} as const;
