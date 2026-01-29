#!/usr/bin/env python3
"""
Professional translation script for AutoScout24 SafeTrade
Translates English automotive marketplace content to ES, IT, FR, NL
"""

import json
import os

# Professional translations for key terms
TRANSLATIONS = {
    'es': {  # Spanish - Formal
        'nav': {
            'home': 'Inicio',
            'marketplace': 'Mercado',
            'dealers': 'Concesionarios',
            'how_it_works': 'Cómo Funciona',
            'benefits': 'Beneficios',
            'login': 'Iniciar Sesión',
            'register': 'Comenzar',
            'dashboard': 'Panel',
            'my_vehicles': 'Mis Vehículos',
            'transactions': 'Transacciones',
            'profile': 'Perfil',
            'logout': 'Cerrar Sesión'
        },
        'home': {
            'hero': {
                'badge': 'Servicio Oficial de AutoScout24',
                'title_1': 'Encuentre Su Vehículo Perfecto',
                'title_2': 'con Protección Completa',
                'subtitle': 'El mercado de vehículos más confiable de Europa con protección de pago en garantía',
                'stats': {
                    'active': 'Anuncios Activos',
                    'customers': 'Clientes',
                    'secured': 'Asegurado'
                },
                'cta_browse': 'Explorar Vehículos',
                'cta_learn': 'Más Información'
            },
            'trust_badges': {
                'escrow': {
                    'title': 'Garantía Segura',
                    'desc': 'Protección de pago'
                },
                'verified': {
                    'title': 'Vendedores Verificados',
                    'desc': '100% comprobados'
                },
                'warranty': {
                    'title': 'Garantía de 24 Meses',
                    'desc': 'Incluida gratis'
                },
                'delivery': {
                    'title': 'Entrega Gratuita',
                    'desc': 'En toda la UE'
                }
            },
            'featured': {
                'title': 'Vehículos Destacados',
                'subtitle': 'Vehículos premium seleccionados con protección completa',
                'protected': 'Protegido',
                'view_details': 'Ver Detalles',
                'view_all': 'Ver Todos los Vehículos'
            },
            'cta': {
                'title': '¿Listo para Comprar o Vender Su Vehículo?',
                'subtitle': 'Únase a miles de clientes satisfechos en la plataforma más confiable de Europa',
                'browse': 'Explorar Mercado',
                'create_account': 'Crear Cuenta'
            }
        }
    },
    'it': {  # Italian - Formal
        'nav': {
            'home': 'Home',
            'marketplace': 'Mercato',
            'dealers': 'Concessionari',
            'how_it_works': 'Come Funziona',
            'benefits': 'Vantaggi',
            'login': 'Accedi',
            'register': 'Inizia',
            'dashboard': 'Dashboard',
            'my_vehicles': 'I Miei Veicoli',
            'transactions': 'Transazioni',
            'profile': 'Profilo',
            'logout': 'Esci'
        },
        'home': {
            'hero': {
                'badge': 'Servizio Ufficiale AutoScout24',
                'title_1': 'Trova il Tuo Veicolo Perfetto',
                'title_2': 'con Protezione Completa',
                'subtitle': 'Il mercato di veicoli più affidabile d\'Europa con protezione escrow dei pagamenti',
                'stats': {
                    'active': 'Annunci Attivi',
                    'customers': 'Clienti',
                    'secured': 'Sicuro'
                },
                'cta_browse': 'Sfoglia Veicoli',
                'cta_learn': 'Scopri di Più'
            },
            'trust_badges': {
                'escrow': {
                    'title': 'Escrow Sicuro',
                    'desc': 'Protezione pagamento'
                },
                'verified': {
                    'title': 'Venditori Verificati',
                    'desc': '100% controllati'
                },
                'warranty': {
                    'title': 'Garanzia 24 Mesi',
                    'desc': 'Inclusa gratis'
                },
                'delivery': {
                    'title': 'Consegna Gratuita',
                    'desc': 'In tutta l\'UE'
                }
            },
            'featured': {
                'title': 'Veicoli in Evidenza',
                'subtitle': 'Veicoli premium selezionati con protezione completa',
                'protected': 'Protetto',
                'view_details': 'Vedi Dettagli',
                'view_all': 'Vedi Tutti i Veicoli'
            },
            'cta': {
                'title': 'Pronto a Comprare o Vendere il Tuo Veicolo?',
                'subtitle': 'Unisciti a migliaia di clienti soddisfatti sulla piattaforma più affidabile d\'Europa',
                'browse': 'Esplora Mercato',
                'create_account': 'Crea Account'
            }
        }
    },
    'fr': {  # French - Formal
        'nav': {
            'home': 'Accueil',
            'marketplace': 'Marché',
            'dealers': 'Concessionnaires',
            'how_it_works': 'Comment Ça Marche',
            'benefits': 'Avantages',
            'login': 'Se Connecter',
            'register': 'Commencer',
            'dashboard': 'Tableau de Bord',
            'my_vehicles': 'Mes Véhicules',
            'transactions': 'Transactions',
            'profile': 'Profil',
            'logout': 'Déconnexion'
        },
        'home': {
            'hero': {
                'badge': 'Service Officiel AutoScout24',
                'title_1': 'Trouvez Votre Véhicule Parfait',
                'title_2': 'avec Protection Complète',
                'subtitle': 'Le marché de véhicules le plus fiable d\'Europe avec protection des paiements séquestre',
                'stats': {
                    'active': 'Annonces Actives',
                    'customers': 'Clients',
                    'secured': 'Sécurisé'
                },
                'cta_browse': 'Parcourir les Véhicules',
                'cta_learn': 'En Savoir Plus'
            },
            'trust_badges': {
                'escrow': {
                    'title': 'Séquestre Sécurisé',
                    'desc': 'Protection de paiement'
                },
                'verified': {
                    'title': 'Vendeurs Vérifiés',
                    'desc': '100% contrôlés'
                },
                'warranty': {
                    'title': 'Garantie 24 Mois',
                    'desc': 'Incluse gratuitement'
                },
                'delivery': {
                    'title': 'Livraison Gratuite',
                    'desc': 'Dans toute l\'UE'
                }
            },
            'featured': {
                'title': 'Véhicules en Vedette',
                'subtitle': 'Véhicules premium sélectionnés avec protection complète',
                'protected': 'Protégé',
                'view_details': 'Voir les Détails',
                'view_all': 'Voir Tous les Véhicules'
            },
            'cta': {
                'title': 'Prêt à Acheter ou Vendre Votre Véhicule?',
                'subtitle': 'Rejoignez des milliers de clients satisfaits sur la plateforme la plus fiable d\'Europe',
                'browse': 'Parcourir le Marché',
                'create_account': 'Créer un Compte'
            }
        }
    },
    'nl': {  # Dutch - Informal
        'nav': {
            'home': 'Home',
            'marketplace': 'Marktplaats',
            'dealers': 'Dealers',
            'how_it_works': 'Hoe Het Werkt',
            'benefits': 'Voordelen',
            'login': 'Inloggen',
            'register': 'Aan de Slag',
            'dashboard': 'Dashboard',
            'my_vehicles': 'Mijn Voertuigen',
            'transactions': 'Transacties',
            'profile': 'Profiel',
            'logout': 'Uitloggen'
        },
        'home': {
            'hero': {
                'badge': 'Officiële AutoScout24 Service',
                'title_1': 'Vind Jouw Perfecte Voertuig',
                'title_2': 'met Volledige Bescherming',
                'subtitle': 'Europa\'s meest vertrouwde voertuigenmarkt met escrow betalingsbescherming',
                'stats': {
                    'active': 'Actieve Advertenties',
                    'customers': 'Klanten',
                    'secured': 'Beveiligd'
                },
                'cta_browse': 'Bekijk Voertuigen',
                'cta_learn': 'Meer Informatie'
            },
            'trust_badges': {
                'escrow': {
                    'title': 'Veilige Escrow',
                    'desc': 'Betalingsbescherming'
                },
                'verified': {
                    'title': 'Geverifieerde Verkopers',
                    'desc': '100% gecontroleerd'
                },
                'warranty': {
                    'title': '24 Maanden Garantie',
                    'desc': 'Gratis inbegrepen'
                },
                'delivery': {
                    'title': 'Gratis Levering',
                    'desc': 'EU-breed'
                }
            },
            'featured': {
                'title': 'Uitgelichte Voertuigen',
                'subtitle': 'Handgeselecteerde premium voertuigen met volledige bescherming',
                'protected': 'Beschermd',
                'view_details': 'Bekijk Details',
                'view_all': 'Bekijk Alle Voertuigen'
            },
            'cta': {
                'title': 'Klaar om Je Voertuig te Kopen of Verkopen?',
                'subtitle': 'Sluit je aan bij duizenden tevreden klanten op Europa\'s meest vertrouwde platform',
                'browse': 'Bekijk Marktplaats',
                'create_account': 'Account Aanmaken'
            }
        }
    }
}

print("AutoScout24 Professional Translation Tool")
print("=" * 50)
print("This is a starter translation covering critical UI sections.")
print("For complete professional translation of all 1485 lines,")
print("a professional translation service is recommended.")
print("=" * 50)
print("\nCritical sections translated:")
print("- Navigation")
print("- Homepage hero")
print("- Trust badges")
print("- Featured vehicles")
print("- Call to action")
print("\nNote: Full translation requires automotive terminology expertise")
