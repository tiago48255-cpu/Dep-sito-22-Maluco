import { Product, Order } from './types';

export const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: 'sports_bar' },
  { id: 'cerveja', name: 'Cervejas', icon: 'sports_bar' },
  { id: 'whisky', name: 'Whisky', icon: 'liquor' },
  { id: 'vinho', name: 'Vinhos', icon: 'wine_bar' },
  { id: 'gelo', name: 'Gelo & Afins', icon: 'ac_unit' },
  { id: 'outro', name: 'Snacks & Energéticos', icon: 'cookie' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'heineken-ln',
    name: 'Heineken Long Neck',
    description: 'A cerveja premium mais amada, gelada no ponto certo para sua resenha. Entregamos em menos de 20 minutos com a temperatura perfeita.',
    volume: '330ml',
    price: 8.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaKI0XMnofemILMQwxp8TZKN14usA_XmRJqot7lnesofqTqysuF4iROlpmu1phF1I-33IzIGFKms72RVTZO3aA5ZoPO280JhKz2mEjNYI8wDGOWKoQyEkDh5U_haCHjzb3g_GqEhnYKZvb3XxD0G6xR7KpOJBErAE9xHUitJaOZswOvtm8en4TeAqOP-pcIyUb3_SM-vkDyxQ1-HJcm5lq9j_f2nbfM5pNkwVwcyJ7J-4x-aLqOqz7QR6GzNCwOgAfXfFAeniesk0',
    category: 'cerveja',
    subCategory: 'Lager',
    rating: 4.8,
    isGelada: true,
    isTurbo: true,
    estimatedTime: '15-25 min',
    temperature: '-2°C Ideal'
  },
  {
    id: 'budweiser-ln',
    name: 'Budweiser Long Neck',
    description: 'Cerveja Budweiser americana clássica, leve e refrescante com sabor equilibrado. Perfeita para qualquer celebração.',
    volume: '330ml',
    price: 7.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWobdVH7whkoiD0uWEtOCj9Bso5rdcZ-SzX2DFHBbOgUU6wxit477mR2Cjy-17S2rT0BHCR4cbvwfmqmkCnQCvBBqdKrntvhNG7A1rbYVov5cMxzY9KzvUpVLatSATJEB1EoMt_1Og7Hv_x9iqm8rCCCxsWdF0btJEXJS7nWPxqU5Q9ayRgC1XIjE20ShcPyhmB7VYN4ww0QFea5Vhpft32kS8PMrpmaXwx47VW2j1u2xM0VsQlrh-aHY7305ud31InhSK1w9RGbE',
    category: 'cerveja',
    subCategory: 'Lager',
    rating: 4.6,
    isGelada: true,
    isTurbo: true,
    estimatedTime: '15-25 min',
    temperature: '-1°C Ideal'
  },
  {
    id: 'stella-ln',
    name: 'Stella Artois Long Neck',
    description: 'Cerveja Premium Lager belga de receita clássica, com amargor suave e aromas elegantes.',
    volume: '330ml',
    price: 9.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXG78U2AVcyDCwA21cqjSH9QzOODRXDyVbB_hdAwjdzrLKifjwagXYRB6JYoIKz-uz7RqjldVXHE_EbwkWTLBkY4zu6EtjvAQwq7_bkG39aOHls1FJ_bNXzlA84Q2HEfA_oIoyFuJ_Eh8Ed9zQ_kFSiJdeMOZMj73TXAyTV8ThcP1ntdeiGz6jzTlLvnznJuo9qX7GXt9f5P0xkn4U7C_eMX_K65OTFcDfsmJVCWyf2x6nnfb20xs2JwsGzpTgs2ElE8vgv5dJY9Q', // uses high-quality beer placeholder
    category: 'cerveja',
    subCategory: 'Pilsen',
    rating: 4.7,
    isGelada: true,
    isTurbo: true,
    estimatedTime: '15-25 min',
    temperature: '-2°C Ideal'
  },
  {
    id: 'skol-beats-senses',
    name: 'Skol Beats Senses 269ml',
    description: 'Bebida alcoólica mista, leve, refrescante e surpreendente. O sabor inconfundível do Beats Senses em lata individual para sua curtição.',
    volume: 'Pack c/ 6 unidades',
    price: 45.00,
    originalPrice: 52.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCArzelu27jRfnltY6IR6odlFvJN0OqQJ4_5Ara-4fE8chSH_mfdhVgSolpYzVJq8iyxe01GPYyPBwRPg6syZT5YbsO49TojvnJrxYMLtPUn0-1BApdGJ3_JD5I68tE-eDNA9UN8UuXehJY7k00Jp7jpjApRGZfa6YELkS89tvloBsq8rFqZvDYtafQdVzFNjGULMEGW6rqK7fMJC7CAf-0tndcfwpm9sxxSaOBA3jkw5R1I30nOBvFymvwMf1agH5g2LSwksPhFvQ',
    category: 'cerveja',
    subCategory: 'Especiais',
    rating: 4.7,
    isGelada: true,
    isTurbo: false
  },
  {
    id: 'jack-daniels',
    name: "Jack Daniel's Tennessee Whiskey",
    description: 'O mundialmente famoso uísque de embalagem quadradinha preta, suavizado gota a gota por carvão de maple antes de ir para o barril.',
    volume: 'Garrafa 1 Litro',
    price: 149.90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnixw55KExnDoubOwjX8Z5yog2GEiauVwE1gtpIEv69QUQM1ronebXkkdPwnyy8Xtx_NO9R5ssqqnxcAP5sz7g4ua9_G9AFd7vD8L2U39Zi3uuPPSlDeLw-jNg4Q2pZNlCkJOd2xnmm7EY0FgWQyl9103kH38qmf1u2X-1kQx9zV9EPmy_lE_hYTdNNh2LQWT_xEpBy5aD2zHCtJiaRlWZ6-HAPrD3g5ybTyQEsrsW2ewfI8KFAXnPfFaUN8vhRE6BnAOGo75e-Ws',
    category: 'whisky',
    rating: 4.9,
    isGelada: false,
    isTurbo: true
  },
  {
    id: 'skol-pilsen-350',
    name: 'Skol Pilsen Lata',
    description: 'A cerveja Pilsen leve, refrescante e redonda por excelência. Pronta para acompanhar em todos os churrascos.',
    volume: '350ml',
    price: 4.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWobdVH7whkoiD0uWEtOCj9Bso5rdcZ-SzX2DFHBbOgUU6wxit477mR2Cjy-17S2rT0BHCR4cbvwfmqmkCnQCvBBqdKrntvhNG7A1rbYVov5cMxzY9KzvUpVLatSATJEB1EoMt_1Og7Hv_x9iqm8rCCCxsWdF0btJEXJS7nWPxqU5Q9ayRgC1XIjE20ShcPyhmB7VYN4ww0QFea5Vhpft32kS8PMrpmaXwx47VW2j1u2xM0VsQlrh-aHY7305ud31InhSK1w9RGbE', // beer placeholder
    category: 'cerveja',
    subCategory: 'Pilsen',
    rating: 4.4,
    isGelada: true,
    isTurbo: true
  },
  {
    id: 'brahma-duplo-malte',
    name: 'Brahma Duplo Malte Lata',
    description: 'A união perfeita entre o sabor marcante do malte Pilsen e a cremosidade do malte Munich.',
    volume: '350ml',
    price: 5.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaKI0XMnofemILMQwxp8TZKN14usA_XmRJqot7lnesofqTqysuF4iROlpmu1phF1I-33IzIGFKms72RVTZO3aA5ZoPO280JhKz2mEjNYI8wDGOWKoQyEkDh5U_haCHjzb3g_GqEhnYKZvb3XxD0G6xR7KpOJBErAE9xHUitJaOZswOvtm8en4TeAqOP-pcIyUb3_SM-vkDyxQ1-HJcm5lq9j_f2nbfM5pNkwVwcyJ7J-4x-aLqOqz7QR6GzNCwOgAfXfFAeniesk0', // beer placeholder
    category: 'cerveja',
    subCategory: 'Pilsen',
    rating: 4.7,
    isGelada: true,
    isTurbo: true
  },
  {
    id: 'doritos-nacho',
    name: 'Doritos Nacho Cheese',
    description: 'Tortas de milho sabor queijo nacho crocantes, salgadas e inigualáveis, deliciosas do primeiro ao último pedaço.',
    volume: '90g',
    price: 7.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtVNQ_WmVrlrmalyK-6jy2hRF7KR_vKjpiiE7GmeofL_VWf7-ndmkob_rb30wEkNoYU41DqSAggYCkiRZG3CBWIShruMV_9MziLWK_NaouDIkw99Jaup3AKyY8-YFFJdIgkg3jhnzm79SiRxBm17QU3Vyd314mpgzg-sGnuOXLAogmH7_02aJWtZeV7stqGnt56gYB-HXe9r_KAiiEHQ3ct-mS97IDkXYZjE7hkjRRfryLiGrcIRC8nbP8pzF0DO2KCN9dREYoQf4',
    category: 'outro',
    rating: 4.5,
    isGelada: false,
    isTurbo: true
  },
  {
    id: 'red-bull',
    name: 'Red Bull Energy Drink',
    description: 'Red Bull te dá asas. Bebida energética valorizada por atletas, estudantes e profissionais ativos em todo o mundo.',
    volume: '473ml',
    price: 10.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxmDAzWNxiz4pdu7Ckl0dBF0McntJVhoucxURuhTUG5PhVGnEbJDfSelha4gIb3EoUw69abPXqnA-86dpyWt0jq-itEdes3m_hUJCrWQkgaw1-ogCI5PQRK7NfB4iqRU7dewD9xSqNj4IGJg5SVYOB83V9aMD6Mbe8w4oUECjX3qDqwemlW91pEqYRIMUYGK9GoRkdLJ1PBW78ROQOhF0msS-LRWvqOTLNDEdQ6jlTwMKr4iJOg1ZcA7hc_7l_nLtXcaO-oheMs3E',
    category: 'outro',
    rating: 4.8,
    isGelada: true,
    isTurbo: true
  },
  {
    id: 'mix-aperitivo',
    name: 'Mix Aperitivo Gourmet',
    description: 'Uma mistura deliciosa de amendoins crocantes, amêndoas, nozes secas e damascos preparados com carinho.',
    volume: '150g',
    price: 12.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4Yq9IvisBMkxhLVw1-ILQXkMoE74AqEuFmgcXuO9WNKCrBRSIp8tpwGPUNgLXQKqiCzQFXN7wqTOAMoqQLRoYZy-O1HheKRWA1OY5ao9ciHl0xBLVfPhe7mUlBoziQELMujlOrJ0ZuXK2JWrrx95UUdMSeg0l6YHthIU-Mbw_xrfI_Un6A4FhVJr2AyTnODI12cO2ifLMuwGC7tBhlh_lmqmUM2bfY3rb-qFrKk2QNXizEemlyLcn6ibigTkXJsktSW28PmqbysY',
    category: 'outro',
    rating: 4.4,
    isGelada: false,
    isTurbo: false
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: '#2256',
    date: '26/05/2024 às 21:30',
    status: 'A caminho',
    total: 38.00,
    subtotal: 33.00,
    deliveryFee: 5.00,
    discount: 0,
    items: [
      {
        product: PRODUCTS[0], // Heineken Long Neck
        quantity: 1,
      },
      {
        product: PRODUCTS[8], // Red Bull Energy Drink
        quantity: 1,
      },
      {
        product: PRODUCTS[7], // Doritos Nacho Cheese
        quantity: 2,
      },
    ],
    deliveryAddress: 'Rua Exemplo, 123 - Caioaba, Nova Iguaçu - RJ',
    paymentMethod: 'PIX',
    trackingEvents: [
      { title: 'Pedido recebido', description: 'Seu pedido foi confirmado', time: '21:30', completed: true },
      { title: 'Preparando pedido', description: 'Suas bebidas estão sendo geladas', time: '21:32', completed: true },
      { title: 'Aguardando entregador', description: 'Entregador está retirando o pedido', time: '21:40', completed: true },
      { title: 'Saiu para entrega', description: 'O entregador está próximo de você', time: '21:45', completed: true, active: true },
      { title: 'Entregue', description: 'Previsão de entrega: 21:55', time: '--:--', completed: false },
    ],
    courier: {
      name: 'João Santos',
      rating: 4.9,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7qb02VP8vrWRALW0UdONztxKOP53tZcRl2w0kV4RKE_Hc6U-uKqtoC7YwLsqXlGhhLXXqdg_VCl59gbnBbDNBGNuXSNGaZcEcqs7rB4eYkK3Co7M6JZwz6wvLvupgJai7hq-7B7iQLQY75-picH57Ysz2hV9mbQ0OBxLMgk9CYd8OI3Fs2VOdXGPZkUR16v2bX30fpJ_tL1dCv0L3PNv1woXE5HG7JOFoKu_tDcawxTVa92xsJahx2aO43rvH6gKeLHrBOL4XmLo',
    },
  },
  {
    id: '#2231',
    date: '24/05/2024 às 22:10',
    status: 'Entregue',
    total: 52.50,
    subtotal: 47.50,
    deliveryFee: 5.00,
    discount: 0,
    items: [
      {
        product: PRODUCTS[1], // Budweiser
        quantity: 5,
      },
      {
        product: PRODUCTS[7], // Doritos
        quantity: 1,
      }
    ],
    deliveryAddress: 'Rua Exemplo, 123 - Caioaba, Nova Iguaçu - RJ',
    paymentMethod: 'Dinheiro',
    trackingEvents: [
      { title: 'Pedido recebido', description: 'Seu pedido foi confirmado', time: '22:10', completed: true },
      { title: 'Preparando pedido', description: 'Suas bebidas estão sendo geladas', time: '22:15', completed: true },
      { title: 'Iniciando entrega', description: 'O entregador já coletou os itens', time: '22:22', completed: true },
      { title: 'Entregue', description: 'Entregue com sucesso!', time: '22:38', completed: true },
    ],
  },
  {
    id: '#2201',
    date: '22/05/2024 às 20:15',
    status: 'Entregue',
    total: 27.00,
    subtotal: 22.00,
    deliveryFee: 5.00,
    discount: 0,
    items: [
      {
        product: PRODUCTS[1], // Budweiser
        quantity: 2,
      },
      {
        product: PRODUCTS[7], // Doritos Nacho Cheese
        quantity: 1,
      },
    ],
    deliveryAddress: 'Rua Exemplo, 123 - Caioaba, Nova Iguaçu - RJ',
    paymentMethod: 'Cartão de Crédito',
    trackingEvents: [],
  },
  {
    id: '#2187',
    date: '19/05/2024 às 19:45',
    status: 'Entregue',
    total: 45.00,
    subtotal: 45.00,
    deliveryFee: 0.00,
    discount: 0,
    items: [
      {
        product: PRODUCTS[3], // Skol Beats Senses Pack
        quantity: 1,
      },
    ],
    deliveryAddress: 'Rua Exemplo, 123 - Caioaba, Nova Iguaçu - RJ',
    paymentMethod: 'PIX',
    trackingEvents: [],
  },
];
