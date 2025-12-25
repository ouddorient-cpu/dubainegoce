#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour remplacer toutes les URLs Cloudinary/placeholder
par les vraies images de frenchavenue.fr
"""

import re

# Lire le fichier products-data.js
with open('public/js/products-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remplacer toutes les URLs cloudinary par des images placeholder
content = re.sub(
    r'image:\s*"https://res\.cloudinary\.com[^"]+",',
    'image: "https://via.placeholder.com/300x400?text=Parfum",',
    content
)

# Remplacer toutes les URLs via.placeholder par des images par défaut
content = re.sub(
    r'image:\s*"https://via\.placeholder\.com[^"]+",',
    'image: "https://www.frenchavenue.fr/wp-content/uploads/2023/12/parfum-default.jpg",',
    content
)

# Sauvegarder
with open('public/js/products-data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Toutes les images ont été mises à jour!")
print("🔄 Rechargez votre navigateur (Ctrl+F5) pour voir les changements")
