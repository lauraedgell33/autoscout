#!/usr/bin/env python3
import json
import sys

# Load English source
with open('scout-safe-pay-frontend/messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Professional automotive translations - ES (Spanish)
es_translations = {
    # Navigation
    "Home": "Inicio",
    "Marketplace": "Mercado",
    "Dealers": "Concesionarios",
    "How It Works": "Cómo Funciona",
    "Benefits": "Beneficios",
    "Sign In": "Iniciar Sesión",
    "Get Started": "Comenzar",
    "Dashboard": "Panel",
    "My Vehicles": "Mis Vehículos",
    "Transactions": "Transacciones",
    "Profile": "Perfil",
    "Logout": "Cerrar Sesión",
    
    # Common terms
    "Vehicle": "Vehículo",
    "Vehicles": "Vehículos",
    "Price": "Precio",
    "Year": "Año",
    "Mileage": "Kilometraje",
    "Search": "Buscar",
    "Filter": "Filtrar",
    "Sort": "Ordenar",
    "Details": "Detalles",
    "Contact": "Contacto",
    "Seller": "Vendedor",
    "Buyer": "Comprador",
    "Payment": "Pago",
    "Secure": "Seguro",
    "Protected": "Protegido",
    "Verified": "Verificado",
    "Warranty": "Garantía",
    "Delivery": "Entrega",
    "Free": "Gratis",
    "View": "Ver",
    "Buy": "Comprar",
    "Sell": "Vender",
    "Save": "Guardar",
    "Cancel": "Cancelar",
    "Confirm": "Confirmar",
    "Continue": "Continuar",
    "Back": "Atrás",
    "Next": "Siguiente",
    "Previous": "Anterior",
    "Loading": "Cargando",
    "Error": "Error",
    "Success": "Éxito",
    "Warning": "Advertencia",
    "Info": "Información",
}

# Basic translation function (simplified - in production use professional translation API)
def translate_value(text, lang):
    if isinstance(text, dict):
        return {k: translate_value(v, lang) for k, v in text.items()}
    elif isinstance(text, list):
        return [translate_value(item, lang) for item in text]
    elif isinstance(text, str):
        # Keep placeholders
        if '{' in text or '<' in text:
            return text  # Don't translate strings with placeholders
        # Simple word replacement (in production, use proper translation API)
        if lang == 'es' and text in es_translations:
            return es_translations[text]
        return text
    else:
        return text

print("Translation script loaded. Use professional translation API for production.")
print(f"English file has {len(json.dumps(en_data))} characters to translate")
