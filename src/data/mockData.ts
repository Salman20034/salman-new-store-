export interface Product {
  id: string;
  name: string;
  nameMl?: string; // Malayalam name
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  stockQuantity: number;
  unit: string;
  isLocal?: boolean;
}

export const CATEGORIES = [
  "Fruits & Vegetables",
  "Rice & Grains",
  "Dairy Products",
  "Snacks",
  "Beverages",
  "Stationery",
  "Spices & Masalas",
  "Meat & Fish",
  "Personal Care",
  "Household"
];

const generateProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const adjectives = ['Fresh', 'Organic', 'Premium', 'Local', 'Imported', 'MK Special', 'Natural', 'Farm', 'Quality', 'Pure', 'Healthy', 'Tasty'];
  const items = [
    { name: 'Apple', nameMl: 'ആപ്പിൾ', category: 'Fruits & Vegetables', unit: '1 kg', basePrice: 120 },
    { name: 'Banana', nameMl: 'പഴം', category: 'Fruits & Vegetables', unit: '1 kg', basePrice: 60 },
    { name: 'Milk', nameMl: 'പാൽ', category: 'Dairy Products', unit: '500 ml', basePrice: 25 },
    { name: 'Bread', nameMl: 'ബ്രെഡ്', category: 'Snacks', unit: '1 pack', basePrice: 40 },
    { name: 'Matta Rice', nameMl: 'മട്ട അരി', category: 'Rice & Grains', unit: '5 kg', basePrice: 200 },
    { name: 'Dal', nameMl: 'പരിപ്പ്', category: 'Rice & Grains', unit: '1 kg', basePrice: 150 },
    { name: 'Chicken', nameMl: 'ചിക്കൻ', category: 'Meat & Fish', unit: '1 kg', basePrice: 250 },
    { name: 'Soap', nameMl: 'സോപ്പ്', category: 'Personal Care', unit: '1 pc', basePrice: 35 },
    { name: 'Detergent', nameMl: 'ഡിറ്റർജന്റ്', category: 'Household', unit: '1 kg', basePrice: 180 },
    { name: 'Tea', nameMl: 'ചായ', category: 'Beverages', unit: '250 g', basePrice: 100 },
    { name: 'Coffee', nameMl: 'കാപ്പി', category: 'Beverages', unit: '100 g', basePrice: 150 },
    { name: 'Chips', nameMl: 'ചിപ്സ്', category: 'Snacks', unit: '1 pack', basePrice: 20 },
    { name: 'Juice', nameMl: 'ജ്യൂസ്', category: 'Beverages', unit: '1 L', basePrice: 90 },
    { name: 'Yogurt', nameMl: 'തൈര്', category: 'Dairy Products', unit: '400 g', basePrice: 60 },
    { name: 'Eggs', nameMl: 'മുട്ട', category: 'Dairy Products', unit: '12 pcs', basePrice: 80 },
    { name: 'Notebook', nameMl: 'നോട്ടുബുക്ക്', category: 'Stationery', unit: '1 pc', basePrice: 45 },
    { name: 'Pen', nameMl: 'പേന', category: 'Stationery', unit: '1 pc', basePrice: 10 },
    { name: 'Black Pepper', nameMl: 'കുരുമുളക്', category: 'Spices & Masalas', unit: '100 g', basePrice: 80 },
    { name: 'Cardamom', nameMl: 'ഏലക്ക', category: 'Spices & Masalas', unit: '50 g', basePrice: 150 },
  ];

  for (let i = 0; i < count; i++) {
    const item = items[i % items.length];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const priceMultiplier = 0.8 + (Math.random() * 0.7); // 0.8x to 1.5x
    const price = Math.round(item.basePrice * priceMultiplier);
    const hasDiscount = Math.random() > 0.7;
    const originalPrice = hasDiscount ? Math.round(price * 1.2) : undefined;
    const stock = Math.floor(Math.random() * 200);
    
    products.push({
      id: `prod-${i + 1}`,
      name: `${adj} ${item.name} ${i + 1}`,
      nameMl: item.nameMl,
      description: `High quality ${adj.toLowerCase()} ${item.name.toLowerCase()} sourced directly for MK Store.`,
      price: price,
      originalPrice: originalPrice,
      image: `https://picsum.photos/seed/${item.name.replace(/\s+/g, '')}${i}/400/400`,
      category: item.category,
      stockQuantity: stock,
      unit: item.unit,
      inStock: stock > 0,
      isLocal: Math.random() > 0.5
    });
  }
  return products;
};

export const MOCK_PRODUCTS: Product[] = generateProducts(1050);
