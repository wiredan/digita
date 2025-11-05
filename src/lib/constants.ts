import type { Product, UserProfile, Order, KycStatus } from '@shared/types';
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_01',
    name: 'Organic Hass Avocados',
    description: 'Creamy and delicious Hass avocados, grown using sustainable organic farming methods. Perfect for toast, salads, and guacamole.',
    price: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Green Valley Farms',
    category: 'Fruits',
  },
  {
    id: 'prod_02',
    name: 'Heirloom Tomatoes',
    description: 'A vibrant mix of juicy, flavorful heirloom tomatoes. Bursting with sweet, complex flavors that supermarket tomatoes can\'t match.',
    price: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1561138233-f39a5b55a3c5?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Sunset Orchards',
    category: 'Vegetables',
  },
  {
    id: 'prod_03',
    name: 'Artisanal Sourdough Bread',
    description: 'Handcrafted sourdough bread with a crispy crust and a soft, chewy interior. Made with locally milled flour and a natural starter.',
    price: 6.00,
    imageUrl: 'https://images.unsplash.com/photo-1533087353484-52a73b35331a?q=80&w=800&auto=format&fit=crop',
    sellerName: 'The Daily Rise Bakery',
    category: 'Bakery',
  },
  {
    id: 'prod_04',
    name: 'Free-Range Eggs',
    description: 'A dozen large brown eggs from happy, free-range chickens. Rich, golden yolks and exceptional taste.',
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1598965775222-384911325b1a?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Happy Hen Homestead',
    category: 'Dairy & Eggs',
  },
  {
    id: 'prod_05',
    name: 'Raw Wildflower Honey',
    description: 'Unfiltered and unpasteurized raw honey from wildflowers. A sweet, floral taste of nature in a jar.',
    price: 12.00,
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Golden Comb Apiary',
    category: 'Pantry',
  },
  {
    id: 'prod_06',
    name: 'Gourmet Mushroom Mix',
    description: 'A curated selection of fresh gourmet mushrooms, including shiitake, oyster, and cremini. Perfect for sautés, soups, and pasta.',
    price: 9.75,
    imageUrl: 'https://images.unsplash.com/photo-1528504923492-8c22421c39a4?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Fungi Friends Co.',
    category: 'Vegetables',
  },
  {
    id: 'prod_07',
    name: 'Freshly Roasted Coffee Beans',
    description: 'Single-origin Arabica coffee beans, roasted to perfection. Notes of chocolate, citrus, and caramel.',
    price: 18.50,
    imageUrl: 'https://images.unsplash.com/photo-1511920183353-3c7c95a5742c?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Morning Ritual Roasters',
    category: 'Pantry',
  },
  {
    id: 'prod_08',
    name: 'Sweet Corn on the Cob',
    description: 'Four ears of sweet, tender corn, picked at the peak of freshness. Ideal for grilling, boiling, or roasting.',
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1598164074852-36b745f586e3?q=80&w=800&auto=format&fit=crop',
    sellerName: 'Green Valley Farms',
    category: 'Vegetables',
  },
];
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user_123',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  kycStatus: 'verified',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexdoe',
};
export const MOCK_ORDERS: Order[] = [
  {
    id: 'order_01',
    orderNumber: 'VD-845621',
    items: [MOCK_PRODUCTS[1]],
    totalAmount: MOCK_PRODUCTS[1].price,
    buyerId: 'user_123',
    status: 'delivered',
    date: '2023-10-15T14:48:00.000Z',
    trackingNumber: '1Z999AA10123456784',
  },
  {
    id: 'order_02',
    orderNumber: 'VD-845620',
    items: [MOCK_PRODUCTS[4]],
    totalAmount: MOCK_PRODUCTS[4].price,
    buyerId: 'user_123',
    status: 'shipped',
    date: '2023-10-28T10:20:00.000Z',
    trackingNumber: '1Z999AA10123456785',
  },
  {
    id: 'order_03',
    orderNumber: 'VD-845619',
    items: [MOCK_PRODUCTS[6]],
    totalAmount: MOCK_PRODUCTS[6].price,
    buyerId: 'user_123',
    status: 'placed',
    date: '2023-10-30T18:05:00.000Z',
  },
];
export const MOCK_USER_PRODUCTS: Product[] = [
  MOCK_PRODUCTS[1], MOCK_PRODUCTS[4], MOCK_PRODUCTS[6]
].map(p => ({ ...p, sellerName: MOCK_USER_PROFILE.name }));
export interface EducationContent {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
}
export const MOCK_EDUCATION_CONTENT: EducationContent[] = [
  {
    id: 'edu_01',
    title: 'The Future of Sustainable Farming: 5 Key Innovations',
    category: 'Innovation',
    imageUrl: 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=800&auto=format&fit=crop',
    author: 'Dr. Jane Foster',
    date: 'Nov 5, 2023',
    excerpt: 'Discover the groundbreaking technologies and methods that are set to revolutionize agriculture, making it more eco-friendly and efficient.',
    content: 'Sustainable farming is no longer a niche concept; it\'s a global necessity. As the world population grows, the demand for food increases, putting immense pressure on our natural resources. The future of agriculture lies in our ability to innovate and adopt practices that are both productive and environmentally responsible. Here are five key innovations shaping that future.\n\nFirst, precision agriculture, which uses GPS, drones, and IoT sensors, allows farmers to monitor crop health, soil conditions, and weather patterns with unprecedented accuracy. This data-driven approach optimizes the use of water, fertilizers, and pesticides, reducing waste and environmental impact. Second, vertical farming is transforming urban landscapes. By growing crops in stacked layers indoors, vertical farms use significantly less land and water than traditional farms and can be located closer to consumers, reducing transportation costs and carbon emissions. Third, advancements in gene editing technologies like CRISPR are enabling the development of crops that are more resilient to pests, diseases, and climate change. These "super crops" can improve yields and reduce the need for chemical interventions. Fourth, regenerative agriculture focuses on improving soil health. Practices like no-till farming, cover cropping, and rotational grazing help sequester carbon in the soil, enhance biodiversity, and improve water retention. Finally, the rise of ag-tech startups is accelerating the development and adoption of these innovations, creating a vibrant ecosystem of solutions for a more sustainable food system.'
  },
  {
    id: 'edu_02',
    title: 'A Beginner\'s Guide to Crop Rotation',
    category: 'Best Practices',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888e2c0b?q=80&w=800&auto=format&fit=crop',
    author: 'Mark Greene',
    date: 'Oct 22, 2023',
    excerpt: 'Learn the basics of crop rotation, a time-tested technique that improves soil health, manages pests, and boosts your overall yield.',
    content: 'Crop rotation is a fundamental principle of sustainable agriculture that has been practiced for centuries. The concept is simple: instead of planting the same crop in the same place year after year, you alternate the types of crops grown in a specific field. This simple change can have profound benefits for your farm.\n\nThe primary advantage of crop rotation is improved soil health. Different plants have different nutrient requirements and root structures. Legumes, for example, fix nitrogen in the soil, enriching it for subsequent crops like corn, which is a heavy nitrogen feeder. By rotating crops, you can naturally replenish soil nutrients and reduce the need for synthetic fertilizers. Another key benefit is pest and disease management. Many pests and pathogens are specific to certain plant families. When you plant the same crop repeatedly, you create a stable environment for these pests to thrive. By rotating to a different crop family, you break their life cycle, reducing infestations and the need for pesticides. A well-planned rotation also helps with weed control. Some crops, like densely planted cover crops, can outcompete and suppress weeds, reducing the need for herbicides in the following season. Getting started is easy. Group your crops by family (e.g., legumes, brassicas, nightshades) and create a multi-year plan to rotate them through your fields. The result will be healthier soil, healthier crops, and a more resilient and productive farm.'
  },
  {
    id: 'edu_03',
    title: 'Understanding Market Prices: Supply and Demand in Agribusiness',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1620714223084-86c9df242d6a?q=80&w=800&auto=format&fit=crop',
    author: 'Chen Wei',
    date: 'Sep 15, 2023',
    excerpt: 'Navigate the complexities of agricultural markets by understanding the core principles of supply and demand that drive crop prices.',
    content: 'For anyone in agribusiness, understanding market prices is crucial for profitability and long-term success. At its core, the price of any agricultural commodity is determined by the fundamental economic principles of supply and demand. Mastering these concepts can help you make informed decisions about when to sell, what to plant, and how to manage risk.\n\nSupply refers to the total amount of a product available on the market. This is influenced by factors like total acreage planted, weather conditions during the growing season, crop yields, and government policies. A bumper crop due to ideal weather will increase supply, putting downward pressure on prices. Conversely, a drought or flood that reduces yields will decrease supply, causing prices to rise. Demand, on the other hand, is the quantity of a product that consumers are willing and able to buy. It is affected by consumer preferences, population growth, global trade agreements, and the price of substitute goods. For example, a rising global demand for biofuels can increase the price of corn, as it is a key feedstock. The interplay between these two forces creates the market price. When supply exceeds demand, prices fall. When demand outstrips supply, prices rise. By staying informed about global weather patterns, trade news, and consumer trends, you can better anticipate these market shifts and position your business for success.'
  },
];
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  kycStatus: KycStatus;
  joinDate: string;
}
export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: 'user_123', name: 'Alex Doe', email: 'alex.doe@example.com', kycStatus: 'verified', joinDate: '2023-01-15' },
  { id: 'user_456', name: 'Samantha Bee', email: 's.bee@example.com', kycStatus: 'pending', joinDate: '2023-03-22' },
  { id: 'user_789', name: 'John Smith', email: 'j.smith@example.com', kycStatus: 'not_started', joinDate: '2023-05-10' },
  { id: 'user_101', name: 'Maria Garcia', email: 'm.garcia@example.com', kycStatus: 'rejected', joinDate: '2023-06-01' },
];
export interface Dispute {
  id: string;
  orderNumber: string;
  productName: string;
  status: 'open' | 'resolved' | 'escalated';
  date: string;
}
export const MOCK_DISPUTES: Dispute[] = [
  { id: 'disp_01', orderNumber: 'VD-734511', productName: 'Heirloom Tomatoes', status: 'open', date: '2023-10-29' },
  { id: 'disp_02', orderNumber: 'VD-698234', productName: 'Organic Hass Avocados', status: 'resolved', date: '2023-10-25' },
  { id: 'disp_03', orderNumber: 'VD-711298', productName: 'Free-Range Eggs', status: 'escalated', date: '2023-10-28' },
];