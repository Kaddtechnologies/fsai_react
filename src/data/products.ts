
import type { Product } from '@/lib/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Flowserve VX Pump Series',
    description: 'High-performance industrial pump for critical applications. Features advanced sealing technology and robust construction.',
    sku: 'FS-VX-100A',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "industrial pump"
    specifications: {
      FlowRate: 'Up to 500 m³/h',
      Pressure: 'Up to 40 bar',
      Material: 'Duplex Stainless Steel',
      MotorPower: '15 kW - 75 kW',
    },
    availability: 'In Stock',
    price: '$12,500 - $45,000',
  },
  {
    id: 'prod-002',
    name: 'Logix 3800 Digital Positioner',
    description: 'Smart digital valve positioner offering precise control, diagnostics, and easy integration with plant systems.',
    sku: 'FS-LGX-3800',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "digital positioner"
    specifications: {
      Communication: 'HART, Foundation Fieldbus',
      InputSignal: '4-20 mA',
      Accuracy: '±0.5% of full stroke',
      Certifications: 'ATEX, IECEx, FM, CSA',
    },
    availability: 'In Stock',
    price: '$3,200',
  },
  {
    id: 'prod-003',
    name: 'Valtek Mark One Control Valve',
    description: 'Versatile globe control valve known for its reliability and wide range of applications in various industries.',
    sku: 'FS-VT-MK1',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "control valve"
    specifications: {
      Sizes: 'DN 15 to DN 600 (0.5" to 24")',
      PressureClass: 'ASME Class 150 to 2500',
      BodyMaterials: 'Carbon Steel, Stainless Steel, Alloys',
      TrimTypes: 'Contoured, Quick Change, Anti-Cavitation',
    },
    availability: 'Low Stock',
    price: 'Varies by configuration',
  },
  {
    id: 'prod-004',
    name: 'Durco G4 SLEEVELINE Valve',
    description: 'Non-lubricated plug valve designed for severe chemical services, offering bubble-tight shutoff.',
    sku: 'FS-DC-G4SL',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "plug valve"
    specifications: {
      Sizes: '0.5" to 24"',
      PressureRating: 'ASME Class 150, 300, 600',
      BodyMaterials: 'Ductile Iron, Carbon Steel, Stainless Steel, Alloys',
      SleeveMaterial: 'PTFE',
    },
    availability: 'In Stock',
  },
  {
    id: 'prod-005',
    name: 'Limitorque MX Actuator',
    description: 'Electric actuator for multi-turn valves, providing reliable and precise valve operation.',
    sku: 'FS-LMT-MXA',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "electric actuator"
    specifications: {
      TorqueRange: 'Up to 3389 Nm (2500 ft-lbs)',
      Enclosure: 'NEMA 4, 4X, 6; IP66/68',
      PowerSupply: 'Various AC and DC options',
      Control: 'Network, Local, Remote',
    },
    availability: 'Out of Stock',
    price: '$8,000 - $20,000',
  },
];

export const searchMockProducts = (query: string): Product[] => {
  if (!query.trim()) {
    return [];
  }
  const lowerQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.sku.toLowerCase().includes(lowerQuery) ||
    Object.values(product.specifications).some(spec => spec.toLowerCase().includes(lowerQuery))
  );
};

    