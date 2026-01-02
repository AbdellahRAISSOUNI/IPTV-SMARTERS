/**
 * Metadata management for page titles and descriptions
 * Handles SEO metadata for all pages in all languages
 */

import { getFileFromGitHub, updateFileOnGitHub } from './github';

export interface PageMetadata {
  title: string;
  description: string;
}

export interface MetadataContent {
  homepage: PageMetadata;
  blog: PageMetadata;
  blogListing: PageMetadata;
  installation: {
    windows: PageMetadata;
    ios: PageMetadata;
    firestick: PageMetadata;
    smartTv: PageMetadata;
    guide: PageMetadata;
  };
  reseller: PageMetadata;
}

/**
 * Get metadata file for a locale
 */
export async function getMetadataFile(locale: string): Promise<{
  content: MetadataContent;
  sha: string;
  path: string;
}> {
  const filePath = `data/metadata/${locale}.json`;
  
  try {
    const file = await getFileFromGitHub(filePath);
    return {
      content: JSON.parse(file.content),
      sha: file.sha,
      path: file.path,
    };
  } catch (error: any) {
    // If file doesn't exist, return default structure
    if (error.message?.includes('404') || error.message?.includes('Not Found')) {
      return {
        content: getDefaultMetadata(locale),
        sha: '',
        path: filePath,
      };
    }
    throw error;
  }
}

/**
 * Update metadata file
 */
export async function updateMetadataFile(
  locale: string,
  content: MetadataContent,
  sha: string
): Promise<void> {
  const filePath = `data/metadata/${locale}.json`;
  const jsonContent = JSON.stringify(content, null, 2);
  
  await updateFileOnGitHub({
    path: filePath,
    content: jsonContent,
    message: `Update ${locale} page metadata via admin dashboard`,
    sha: sha || undefined,
  });
}

/**
 * Get all metadata files
 */
export async function getAllMetadata(): Promise<Record<string, {
  content: MetadataContent;
  sha: string;
  path: string;
}>> {
  const locales = ['en', 'es', 'fr'];
  const metadata: Record<string, any> = {};

  for (const locale of locales) {
    try {
      const data = await getMetadataFile(locale);
      metadata[locale] = data;
    } catch (error) {
      console.error(`Failed to fetch ${locale} metadata:`, error);
      // Use default if fetch fails
      metadata[locale] = {
        content: getDefaultMetadata(locale),
        sha: '',
        path: `data/metadata/${locale}.json`,
      };
    }
  }

  return metadata;
}

/**
 * Get default metadata structure for a locale
 */
export function getDefaultMetadata(locale: string): MetadataContent {
  const defaults: Record<string, MetadataContent> = {
    en: {
      homepage: {
        title: "Best IPTV Subscription Service | IPTV Smarters Pro | 20,000+ Channels | Free Test | Instant Activation",
        description: "Get the #1 IPTV subscription service with IPTV Smarters Pro. Access 20,000+ live TV channels, movies, and series in 4K quality. 99.9% uptime guarantee. Free test available. Works on Windows, Android, iOS, Mac, Smart TV, Firestick. Instant activation. Premium IPTV subscription plans starting from €19.99. IPTV Smarters Pro codes and accounts available.",
      },
      blog: {
        title: "IPTV Blog | Latest News, Guides & Tips",
        description: "Stay updated with the latest IPTV news, installation guides, tips, and best practices. Learn how to get the most out of your IPTV subscription.",
      },
      blogListing: {
        title: "IPTV Blog | Latest Articles & Guides",
        description: "Browse our collection of IPTV articles, installation guides, tips, and industry news. Everything you need to know about IPTV streaming.",
      },
      installation: {
        windows: {
          title: "How to Install IPTV Smarters Pro on Windows | Step-by-Step Guide",
          description: "Complete step-by-step guide to install IPTV Smarters Pro on Windows PC. Download, install, and configure IPTV Smarters Pro on Windows. Free installation support available.",
        },
        ios: {
          title: "How to Install IPTV Smarters Pro on iOS | iPhone & iPad Guide",
          description: "Complete guide to install IPTV Smarters Pro on iPhone and iPad. Step-by-step instructions for iOS installation. Free support available.",
        },
        firestick: {
          title: "How to Install IPTV Smarters Pro on Firestick | Amazon Fire TV Guide",
          description: "Complete guide to install IPTV Smarters Pro on Amazon Firestick and Fire TV. Easy step-by-step instructions. Free installation support.",
        },
        smartTv: {
          title: "How to Install IPTV Smarters Pro on Smart TV | Complete Guide",
          description: "Complete guide to install IPTV Smarters Pro on Smart TV. Works with Samsung, LG, Android TV, and more. Step-by-step instructions.",
        },
        guide: {
          title: "IPTV Installation Guide | Complete Setup Instructions",
          description: "Complete IPTV installation guide for all devices. Learn how to install IPTV Smarters Pro on Windows, Android, iOS, Smart TV, and Firestick.",
        },
      },
      reseller: {
        title: "IPTV Reseller Program | Start Your IPTV Business",
        description: "Join our IPTV reseller program and start your own IPTV business. Competitive prices, white-label solutions, and dedicated support. Become an IPTV reseller today.",
      },
    },
    es: {
      homepage: {
        title: "Mejor Servicio IPTV | IPTV Smarters Pro | 20,000+ Canales | Prueba Gratis | Activación Instantánea",
        description: "Obtén el servicio de suscripción IPTV #1 con IPTV Smarters Pro. Accede a más de 20,000 canales de TV en vivo, películas y series en calidad 4K. Garantía de 99.9% de tiempo de actividad. Prueba gratuita disponible. Funciona en Windows, Android, iOS, Mac, Smart TV, Firestick. Activación instantánea. Planes de suscripción IPTV premium desde €19.99. Códigos y cuentas IPTV Smarters Pro disponibles.",
      },
      blog: {
        title: "Blog IPTV | Últimas Noticias, Guías y Consejos",
        description: "Mantente actualizado con las últimas noticias de IPTV, guías de instalación, consejos y mejores prácticas. Aprende cómo aprovechar al máximo tu suscripción IPTV.",
      },
      blogListing: {
        title: "Blog IPTV | Últimos Artículos y Guías",
        description: "Explora nuestra colección de artículos IPTV, guías de instalación, consejos y noticias de la industria. Todo lo que necesitas saber sobre streaming IPTV.",
      },
      installation: {
        windows: {
          title: "Cómo Instalar IPTV Smarters Pro en Windows | Guía Paso a Paso",
          description: "Guía completa paso a paso para instalar IPTV Smarters Pro en PC con Windows. Descarga, instala y configura IPTV Smarters Pro en Windows. Soporte de instalación gratuito disponible.",
        },
        ios: {
          title: "Cómo Instalar IPTV Smarters Pro en iOS | Guía para iPhone e iPad",
          description: "Guía completa para instalar IPTV Smarters Pro en iPhone e iPad. Instrucciones paso a paso para instalación en iOS. Soporte gratuito disponible.",
        },
        firestick: {
          title: "Cómo Instalar IPTV Smarters Pro en Firestick | Guía Amazon Fire TV",
          description: "Guía completa para instalar IPTV Smarters Pro en Amazon Firestick y Fire TV. Instrucciones fáciles paso a paso. Soporte de instalación gratuito.",
        },
        smartTv: {
          title: "Cómo Instalar IPTV Smarters Pro en Smart TV | Guía Completa",
          description: "Guía completa para instalar IPTV Smarters Pro en Smart TV. Funciona con Samsung, LG, Android TV y más. Instrucciones paso a paso.",
        },
        guide: {
          title: "Guía de Instalación IPTV | Instrucciones de Configuración Completas",
          description: "Guía completa de instalación IPTV para todos los dispositivos. Aprende cómo instalar IPTV Smarters Pro en Windows, Android, iOS, Smart TV y Firestick.",
        },
      },
      reseller: {
        title: "Programa de Revendedor IPTV | Inicia Tu Negocio IPTV",
        description: "Únete a nuestro programa de revendedor IPTV y comienza tu propio negocio IPTV. Precios competitivos, soluciones white-label y soporte dedicado. Conviértete en revendedor IPTV hoy.",
      },
    },
    fr: {
      homepage: {
        title: "Meilleur Service IPTV | IPTV Smarters Pro | 20,000+ Chaînes | Essai Gratuit | Activation Instantanée",
        description: "Obtenez le service d'abonnement IPTV #1 avec IPTV Smarters Pro. Accédez à plus de 20,000 chaînes TV en direct, films et séries en qualité 4K. Garantie de disponibilité 99.9%. Essai gratuit disponible. Fonctionne sur Windows, Android, iOS, Mac, Smart TV, Firestick. Activation instantanée. Plans d'abonnement IPTV premium à partir de 19,99€. Codes et comptes IPTV Smarters Pro disponibles.",
      },
      blog: {
        title: "Blog IPTV | Dernières Actualités, Guides et Conseils",
        description: "Restez informé des dernières actualités IPTV, guides d'installation, conseils et meilleures pratiques. Apprenez à tirer le meilleur parti de votre abonnement IPTV.",
      },
      blogListing: {
        title: "Blog IPTV | Derniers Articles et Guides",
        description: "Parcourez notre collection d'articles IPTV, guides d'installation, conseils et actualités de l'industrie. Tout ce que vous devez savoir sur le streaming IPTV.",
      },
      installation: {
        windows: {
          title: "Comment Installer IPTV Smarters Pro sur Windows | Guide Étape par Étape",
          description: "Guide complet étape par étape pour installer IPTV Smarters Pro sur PC Windows. Téléchargez, installez et configurez IPTV Smarters Pro sur Windows. Support d'installation gratuit disponible.",
        },
        ios: {
          title: "Comment Installer IPTV Smarters Pro sur iOS | Guide iPhone et iPad",
          description: "Guide complet pour installer IPTV Smarters Pro sur iPhone et iPad. Instructions étape par étape pour l'installation iOS. Support gratuit disponible.",
        },
        firestick: {
          title: "Comment Installer IPTV Smarters Pro sur Firestick | Guide Amazon Fire TV",
          description: "Guide complet pour installer IPTV Smarters Pro sur Amazon Firestick et Fire TV. Instructions faciles étape par étape. Support d'installation gratuit.",
        },
        smartTv: {
          title: "Comment Installer IPTV Smarters Pro sur Smart TV | Guide Complet",
          description: "Guide complet pour installer IPTV Smarters Pro sur Smart TV. Fonctionne avec Samsung, LG, Android TV et plus encore. Instructions étape par étape.",
        },
        guide: {
          title: "Guide d'Installation IPTV | Instructions de Configuration Complètes",
          description: "Guide complet d'installation IPTV pour tous les appareils. Apprenez à installer IPTV Smarters Pro sur Windows, Android, iOS, Smart TV et Firestick.",
        },
      },
      reseller: {
        title: "Programme de Revendeur IPTV | Démarrez Votre Entreprise IPTV",
        description: "Rejoignez notre programme de revendeur IPTV et démarrez votre propre entreprise IPTV. Prix compétitifs, solutions white-label et support dédié. Devenez revendeur IPTV dès aujourd'hui.",
      },
    },
  };

  return defaults[locale] || defaults.en;
}
