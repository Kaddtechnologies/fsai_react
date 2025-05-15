
import type { Product } from '@/lib/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Flowserve VX Pump Series',
    description: 'High-performance industrial pump for critical applications. Features advanced sealing technology and robust construction for demanding environments.',
    sku: 'FS-VX-100A',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "industrial pump"
    specifications: {
      FlowRate: 'Up to 500 m³/h (2200 GPM)',
      Pressure: 'Up to 40 bar (580 psi)',
      Material: 'Duplex Stainless Steel, Alloy C',
      MotorPower: '15 kW - 75 kW (20 HP - 100 HP)',
      TemperatureRange: '-50°C to 300°C (-58°F to 572°F)',
      Certifications: ['API 610', 'ISO 13709'],
    },
    availability: 'In Stock',
    price: '$12,500 - $45,000',
  },
  {
    id: 'prod-002',
    name: 'Logix 3800 Digital Positioner',
    description: 'Smart digital valve positioner offering precise control, advanced diagnostics, and easy integration with modern plant automation systems.',
    sku: 'FS-LGX-3800',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "digital positioner"
    specifications: {
      Communication: 'HART, Foundation Fieldbus, Profibus PA',
      InputSignal: '4-20 mA',
      Accuracy: '±0.5% of full stroke',
      Certifications: ['ATEX', 'IECEx', 'FM', 'CSA', 'SIL 3'],
      OperatingTemperature: '-40°C to 85°C (-40°F to 185°F)',
      Diagnostics: 'Valve signature, Partial Stroke Test (PST)',
    },
    availability: 'In Stock',
    price: '$3,200',
  },
  {
    id: 'prod-003',
    name: 'Valtek Mark One Control Valve',
    description: 'Versatile globe control valve renowned for its reliability, precision, and wide range of applications in various process industries.',
    sku: 'FS-VT-MK1',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "control valve"
    specifications: {
      Sizes: 'DN 15 to DN 600 (0.5" to 24")',
      PressureClass: 'ASME Class 150 to 2500',
      BodyMaterials: 'Carbon Steel, Stainless Steel, Hastelloy, Monel, Titanium',
      TrimTypes: 'Contoured, Quick Change, Anti-Cavitation, Noise Reduction',
      EndConnections: ['Flanged', 'Threaded', 'Socket Weld'],
      LeakageClass: 'ANSI/FCI 70-2 Class IV, V, VI',
    },
    availability: 'Low Stock',
    price: 'Varies by configuration',
  },
  {
    id: 'prod-004',
    name: 'Durco G4 SLEEVELINE Valve',
    description: 'Non-lubricated plug valve designed for severe chemical services, offering bubble-tight shutoff and long service life.',
    sku: 'FS-DC-G4SL',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "plug valve"
    specifications: {
      Sizes: '0.5" to 24" (DN15 to DN600)',
      PressureRating: 'ASME Class 150, 300, 600',
      BodyMaterials: 'Ductile Iron, Carbon Steel, Stainless Steel, Exotic Alloys',
      SleeveMaterial: 'PTFE, PFA, UHMWPE',
      PortType: ['Standard Port', 'Full Port'],
      TemperatureRange: '-29°C to 260°C (-20°F to 500°F)',
    },
    availability: 'In Stock',
    price: 'Varies by configuration',
  },
  {
    id: 'prod-005',
    name: 'Limitorque MX Actuator',
    description: 'Electric actuator for multi-turn valves, providing reliable, precise, and maintenance-friendly valve operation in harsh environments.',
    sku: 'FS-LMT-MXA',
    imageUrl: 'https://placehold.co/300x200.png', // data-ai-hint: "electric actuator"
    specifications: {
      TorqueRange: 'Up to 3389 Nm (2500 ft-lbs)',
      Enclosure: 'NEMA 4, 4X, 6; IP66/68, Explosion-proof options',
      PowerSupply: 'Various AC (single/three phase) and DC options',
      Control: 'Network (Modbus, Profibus, Foundation Fieldbus), Local, Remote',
      Display: 'LCD for status and diagnostics',
      DutyCycle: 'S2 - 15 min / S4 - 25%',
    },
    availability: 'Out of Stock',
    price: '$8,000 - $20,000',
  },
];

export const searchMockProducts = (query: string): Product[] => {
  if (!query.trim()) {
    return []; // Return all products if query is empty or only whitespace. For demo purposes.
               // In a real app, you might return nothing or popular items.
  }
  const lowerQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.sku.toLowerCase().includes(lowerQuery) ||
    (product.price && product.price.toLowerCase().includes(lowerQuery)) ||
    Object.entries(product.specifications).some(([key, value]) => {
      const lowerKey = key.toLowerCase();
      const lowerValue = Array.isArray(value) ? value.join(' ').toLowerCase() : String(value).toLowerCase();
      return lowerKey.includes(lowerQuery) || lowerValue.includes(lowerQuery);
    })
  );
};
