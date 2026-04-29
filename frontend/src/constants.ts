import type { Order, Product, StockItem } from './types.ts';

export const INITIAL_ORDERS: Order[] = [
  {
    id: '1040',
    tableNumber: '08',
    status: 'atrasado',
    createdAt: '2026-04-22T15:20:00Z',
    items: [
      { id: '1', name: 'Smash Burger Double', quantity: 3 },
      { id: '2', name: 'Fries Large', quantity: 2 },
      { id: '3', name: 'Sem Cebola no Burger', quantity: 1, notes: 'Observação' },
    ],
  },
  {
    id: '1042',
    deliveryId: '44',
    status: 'preparando',
    createdAt: '2026-04-22T08:45:00Z',
    items: [
      { id: '4', name: 'Smash Burger', quantity: 2 },
      { id: '5', name: 'Fries', quantity: 1 },
    ],
  },
  {
    id: '1038',
    status: 'pronto',
    createdAt: '2026-04-22T12:00:00Z',
    items: [
      { id: '6', name: 'Veggie Delight', quantity: 1 },
      { id: '7', name: 'Soda 500ml', quantity: 1 },
    ],
  },
  {
    id: '1045',
    tableNumber: '12',
    status: 'recebido',
    createdAt: '2026-04-23T01:12:00Z',
    items: [
      { id: '8', name: 'Chicken Nuggets', quantity: 4 },
      { id: '9', name: 'Chocolate Shake', quantity: 2 },
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smash Burger Clássico',
    price: 28.00,
    description: 'Pão brioche, 2x carnes smash 80g, queijo cheddar, maionese artesanal e picles.',
    category: 'Burgers',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYeBZ47o9f_qXq_pRK4tYmlJOB0mUB2cVCwip7l8SdvyPbg2YKTxsKok4syzUUE7L6FsGVKj-XJkHjDq5T5LjH7Wknmn-Fg_1MyVyy0YxWqIvLP8JSgfX_11JpSr3DFJUHYQmfGJx6TZ4LI3EEtkX-JXINXImtky4xSa8oWQRgM7H7A5CCeBgFvCu2Wa775Vxh0w5v-BYeFGGv0k74poSKXjMBwiV_CvxN8-a75T5BQ1UWvu905yUHAkFF5ihnkAH5_gCajKzQRg-N',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Bacon Deluxe',
    price: 35.00,
    description: 'Carne 160g, tiras de bacon crocante, cebola caramelizada e molho BBQ.',
    category: 'Burgers',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiNlA6-W9LvzoV_-9EDK1bK5UJolDPg7BYDJ-AFvwQ4OdSRCMqodd0PvLSeF20a78Da0lr4q1QUchOLaj5nYbYDkE7xsSVqz6r_5YuIPcmNVyk_Zf80L7M0oBGSQ3r3-peT3r1wtSVIc6LbD0TWRCO9YJVZTodJJjDUBYRgQw5tpQgblObZ313O0qE19Hfilur2vSrE6Kyt-H9y4q8Nu56KxtWPQDRd079RYG96Bft1Y4D0fRYuIiDu67Wa3JLIJoPMglvfp3GaRT5',
  },
  {
    id: '3',
    name: 'Monster Triple',
    price: 42.00,
    description: 'Para quem tem fome: 3 carnes smash, triplo cheddar e bacon em dobro.',
    category: 'Burgers',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2BwCC838LglR2grnPima57VRPdRstXtqkHu2pFTXJ--QodYODi6cXjx90B86qCr6ag7NmokWpviuhr4V7DTSnyQv9B-KZ2Zg3w3kCR9WIRNAP8L6pm5rlswNysuDak_l4ORsigxR43df7lHfsrpkcWYHyoCeLXLcSeOCCM9xATtMYKsjA2w3pJeukHXRh09NdXG1hJVLC323wnZvSgTR6T4SM_xOUvAxOxn8td_j69ld9tG4Cv-BR59FV0S8SAUZKHDNkWlQscOK6',
  },
  {
    id: '4',
    name: 'Crispy Chicken',
    price: 26.00,
    description: 'Filé de frango empanado crocante, alface americana e maionese verde.',
    category: 'Burgers',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_7r9MdEu3P4duNzk1zuGL7SSVCm6AqQ6DqHeveQVvhBmJ8RiBU7mcbaR2hKDFFK0y9qG2G4-PexyS5Ba73a3h-g1LQUPMaQQMNTxCcz53pggUUrxcUvxcpiXw4JxtAdTdF3CQO-yVFvXvMFd6tpQU4qgQY2Jg3ra1WMa3PF2sMsc9Xeh0NKu6VT87Av2zw0XlM8o1qioGfaOTivq0VSG9Qe6hmZ3NazcORm7UiKCvnqVqiwJL9VYRNjnH8fFngK3m5dlfg362t6sn',
  },
];

export const STOCK_ITEMS: StockItem[] = [
  /*{
    id: '1',
    name: 'Pão de Brioche',
    status: 'baixo',
    quantity: 42,
    unit: 'un',
    lastRestock: '2 dias atrás',
    icon: 'bakery_dining',
  },
  {
    id: '2',
    name: 'Carne 150g',
    status: 'normal',
    quantity: 15.5,
    unit: 'kg',
    lastRestock: 'Hoje, 08:30',
    icon: 'kebab_dining',
  },
  {
    id: '3',
    name: 'Queijo Cheddar',
    status: 'baixo',
    quantity: 2.8,
    unit: 'kg',
    lastRestock: '5 dias atrás',
    icon: 'cheese',
  },
  {
    id: '4',
    name: 'Óleo de Fritura',
    status: 'aguardando',
    quantity: 60,
    unit: 'L',
    lastRestock: 'Ontem',
    icon: '',
  },*/


  // PADARIA E MASSAS
  { id: '1', name: 'Pão de Brioche', status: 'normal', quantity: 42, unit: 'un', lastRestock: 'Hoje', icon: '' },
  { id: '2', name: 'Massa de Pizza Artesanal', status: 'normal', quantity: 15, unit: 'kg', lastRestock: 'Ontem', icon: '' },
  
  // LATICÍNIOS
  { id: '3', name: 'Queijo Mussarela', status: 'baixo', quantity: 2.5, unit: 'kg', lastRestock: '5 dias atrás', icon: '' },
  { id: '4', name: 'Leite Condensado', status: 'normal', quantity: 12, unit: 'un', lastRestock: 'Hoje', icon: '' },
  
  // CARNES E EMBUTIDOS
  { id: '5', name: 'Hambúrguer de Picanha', status: 'normal', quantity: 80, unit: 'un', lastRestock: 'Hoje', icon: '' },
  { id: '6', name: 'Bacon Defumado em Tiras', status: 'normal', quantity: 8, unit: 'kg', lastRestock: '2 dias atrás', icon: '' },
  
  // AVES
  { id: '7', name: 'Frango Desfiado', status: 'normal', quantity: 10, unit: 'kg', lastRestock: 'Ontem', icon: '' },
  { id: '8', name: 'Ovos Brancos Tipo A', status: 'baixo', quantity: 3, unit: 'dz', lastRestock: '1 semana atrás', icon: '' },
  
  // JAPONESA / PEIXES
  { id: '9', name: 'Salmão Fresco', status: 'normal', quantity: 4, unit: 'kg', lastRestock: 'Hoje', icon: '' },
  { id: '10', name: 'Alga Nori (Folhas)', status: 'normal', quantity: 500, unit: 'un', lastRestock: 'Ontem', icon: '' },
  
  // VEGETAIS E GRÃOS
  { id: '11', name: 'Alface Americana', status: 'baixo', quantity: 5, unit: 'un', lastRestock: 'Hoje', icon: '' },
  { id: '12', name: 'Arroz Agulhinha', status: 'normal', quantity: 60, unit: 'kg', lastRestock: 'Ontem', icon: '' },
  
  // AÇAÍ E FRUTAS
  { id: '13', name: 'Polpa de Açaí Especial', status: 'normal', quantity: 40, unit: 'L', lastRestock: 'Hoje', icon: '' },
  { id: '14', name: 'Morangos Frescos', status: 'baixo', quantity: 2, unit: 'cx', lastRestock: 'Hoje', icon: '' },
  
  // DOCES E SOBREMESAS
  { id: '15', name: 'Sorvete de Baunilha', status: 'normal', quantity: 5, unit: 'balde', lastRestock: 'Hoje', icon: '' },
  { id: '16', name: 'Chocolate Meio Amargo', status: 'normal', quantity: 10, unit: 'kg', lastRestock: 'Ontem', icon: '' },
  
  // BEBIDAS
  { id: '17', name: 'Coca-Cola 350ml', status: 'normal', quantity: 144, unit: 'un', lastRestock: 'Ontem', icon: '' },
  { id: '18', name: 'Cerveja Pilsen Chopp', status: 'normal', quantity: 50, unit: 'L', lastRestock: 'Hoje', icon: '' },
  { id: '19', name: 'Café em Grãos', status: 'normal', quantity: 5, unit: 'kg', lastRestock: 'Hoje', icon: '' },
  
  // MOLHOS E TEMPEROS
  { id: '20', name: 'Maionese Temperada', status: 'normal', quantity: 5, unit: 'kg', lastRestock: 'Hoje', icon: '' },
  { id: '21', name: 'Sal Refinado', status: 'normal', quantity: 10, unit: 'kg', lastRestock: 'Mês passado', icon: '' },
  
  // PADRÃO (TESTE DE ERRO)
  { id: '22', name: 'Embalagem Delivery G', status: 'normal', quantity: 200, unit: 'un', lastRestock: 'Hoje', icon: '' },
];



  /*{ id: '1', name: 'Pão de Brioche', status: 'normal', quantity: 50, unit: 'un', lastRestock: 'Hoje', icon: '' },
  { id: '2', name: 'Queijo Cheddar fatiado', status: 'baixo', quantity: 2, unit: 'kg', lastRestock: 'Ontem', icon: '' },
  { id: '3', name: 'Picanha Maturada', status: 'normal', quantity: 15, unit: 'kg', lastRestock: 'Hoje', icon: '' },
  { id: '4', name: 'Coca-Cola 2L', status: 'normal', quantity: 24, unit: 'un', lastRestock: '2 dias atrás', icon: '' },
  { id: '5', name: 'Salmão para Sushi', status: 'baixo', quantity: 3, unit: 'kg', lastRestock: 'Hoje', icon: '' },
  { id: '6', name: 'Sorvete de Baunilha', status: 'normal', quantity: 10, unit: 'L', lastRestock: 'Hoje', icon: '' },
  { id: '7', name: 'Alface Americana', status: 'baixo', quantity: 1, unit: 'un', lastRestock: 'Hoje', icon: '' },
  { id: '8', name: 'Coca-Cola ', status: 'normal', quantity: 24, unit: 'un', lastRestock: '2 dias atrás', icon: '' },
];*/