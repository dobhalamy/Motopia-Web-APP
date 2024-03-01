import { getNodeEnv } from './utils/env';

const env = getNodeEnv();

export const BASE_URL = 'https://api.intuitivedms.com/api';

export const ADMIN_BASE_URL = env
  ? 'https://api-staging.gomotopia.com/v1/'
  : 'https://api.gomotopia.com/v1/';

export const CARFAX_URL =
  'https://luxor-lic.intuitivedms.com/images/carfax/sticker/';

export const BACKGROUND_BASE_URL =
  'https://res.cloudinary.com/luxor-motor-cars-inc/image/upload/bg';
export const TEMPORARY_ADMIN_TOKEN =
  '$2b$10$uRrv8aaeDDdwqFU10c82W.QFdASrGc5XfsYw4agOPa2FaL/N5OjS.';

export const STRIPE_TEST_KEY = 'pk_test_Z7MZzDd8PMr0G0iqe3zzgcp900bCM6amSG';

export const STRIPE_LIVE_KEY = 'pk_live_H7g9shNcrfkskjysJkhSkfhh00m0En6x8a';
export const DMS_PLAID_PDF_UPLOAD =
  'https://api.intuitivedms.com/api/MVR/uploadPdf';
export const DMS_MEDIA_UPLOAD =
  'https://api.intuitivedms.com/api/Account/AccidentMediaUpload';
export const DMS_PHOTO_BASE_URL =
  'https://luxor-lic.intuitivedms.com/images/Accident/PhotoFootage/';
export const DMS_VIDEO_BASE_URL =
  'https://luxor-lic.intuitivedms.com/images/Accident/VideoFootage/';
export const DMS_POLICE_REPORT_BASE_URL =
  'https://luxor-lic.intuitivedms.com/images/Accident/PoliceReport/';

export const SiteUrl = env
  ? 'https://staging.gomotopia.com/'
  : 'https://gomotopia.com/';

export const VideoUrls = {
  OverviewUrl: 'https://vimeo.com/485260119/8a2d4c9399',
  PurchaseUrl: 'https://vimeo.com/485259705/99ff7d2dcc',
  RideShareUrl: 'https://vimeo.com/485259508/d6b9c744cc',
};
export const vimeoConfig = {
  vimeo: {
    playerOptions: {
      autoplay: false,
      controls: true,
    },
  },
};
export const TradeInForm =
  // eslint-disable-next-line max-len
  'https://api.hsforms.com/submissions/v3/integration/submit/7800832/2735dc5f-3fa8-4b15-91f2-d4ecd32887ea';

export const FinanceForm =
  // eslint-disable-next-line max-len
  'https://api.hsforms.com/submissions/v3/integration/submit/7800832/3d03a2ee-75d8-4fee-b387-67bc91a8277d';

export const RideShareForm =
  // eslint-disable-next-line max-len
  'https://api.hsforms.com/submissions/v3/integration/submit/7800832/36bea506-aa53-4c07-8f18-63acecfdacf1';

export const ContactForm =
  // eslint-disable-next-line max-len
  'https://api.hsforms.com/submissions/v3/integration/submit/7800832/26a2e729-ceee-4e1d-b484-d1af4b68a66d';

export const ROUTE_CONSTANTS = [
  { routeTitle: 'Finance', routeValue: '/finance' },
  { routeTitle: 'Trade-in', routeValue: '/trade-in' },
  // NOTE: uncomment when the pages will work
  // { routeTitle: 'How-it-works', routeValue: 'video' },
  { routeTitle: 'Blog', routeValue: '/blog' },
  { routeTitle: 'Our Cities', routeValue: '' },
  { routeTitle: 'Sign-In', routeValue: '/sign-in' },
];

export const SIGN_IN_ROUTE_CONSTANTS = [
  { routeTitle: 'Sign In', routeValue: '/sign-in' },
  { routeTitle: 'User Profile', routeValue: '/profile' },
];
export const MOBILE_ROUTE_CONSTANTS = [
  { routeTitle: 'Ride-share', routeValue: '/ride-share' },
  { routeTitle: 'Search Cars', routeValue: '/search-cars' },
  { routeTitle: 'Finance', routeValue: '/finance' },
  { routeTitle: 'Trade-in', routeValue: '/trade-in' },
  // NOTE: uncomment when the pages will work
  // { routeTitle: 'How Motopia works', routeValue: 'video' },
  { routeTitle: 'Blog', routeValue: '/blog' },
  { routeTitle: 'Our Cities', routeValue: '' },
  { routeTitle: 'Sign-In', routeValue: '/sign-in' },
  { routeTitle: 'Contact us', routeValue: '/contact-us' },
  { routeTitle: 'Terms of use', routeValue: '/terms-of-use' },
  { routeTitle: 'Privacy Policy', routeValue: '/privacy-policy' },
];

export const PROSPECT_SOURCE = {
  login: 'Motopia-SignUp',
  finance: 'Motopia-Finance',
  rideShare: 'Motopia-RideShare',
  card: 'Motopia-CreditCardProcessed',
  contact: 'Motopia-ContactUs',
  tradin: 'Motopia-TradeIn',
  moreinfo: 'Motopia-MoreInfoRequest',
  carfax: 'Motopia-CarFax',
  updateProfile: 'Motopia-UpdateProfile',
  sale: 'Motopia-Sale',
};
export const SEO_PAGES = {
  RIDE_SHARE_HOME: 'ride share home',
  FINANCE: 'finance',
  TRADE_IN: 'trade in',
  HOME_PAGE: 'home page',
};

export const FINANCE_RESULT = 'finance_result';
export const FINANCE_VEHICLE_APPROVAL = 'finance_vehicle_approval';
export const RIDE_SHARE_STEP_1 = 'ride_share_step_1';
export const RIDE_SHARE_STEP_2 = 'ride_share_step_2';
export const RIDE_SHARE_STEP_3 = 'ride_share_step_3';
// Color is taken from design
// it is #44687C with opacity 0.3
export const BORDER_COLOR = '#c7d2d8';

// Color is taken from design
// it is #001C5E with opacity 0.3
export const SECONDARY_WITH_OPACITY = '#b3bbcf';

export const FILTERS_BACKGROUND_COLOR = 'rgba(68, 104, 124, 0.05)';

export const LIGHT_GRAY_BACKGROUND = '#F2F3F7';

export const VEHICLE_BODY_TYPES = [
  {
    title: 'Sedan',
    type: 'SEDAN',
  },
  {
    title: 'SUV',
    type: 'SUV',
  },
  {
    title: 'Truck',
    type: 'TRUCK',
  },
  {
    title: 'Minivan',
    type: 'MINIVAN',
  },
  {
    title: 'Hatchback',
    type: 'HATCHBACK',
  },
  {
    title: 'Convertible',
    type: 'CONVERTIBLE',
  },
  {
    title: 'Coupe',
    type: 'COUPE',
  },
  {
    title: 'Wagon',
    type: 'WAGON',
  },
];

export const VEHICLE_SEATS = ['2', '4', '5', '6', '7', '8'];

export const VEHICLE_EXTERIOR_COLORS = [
  {
    title: 'Black',
    constant: 'BLACK',
    colorCode: '#000000',
  },
  {
    title: 'Charcoal',
    constant: 'CHARCOAL',
    colorCode: '#36454f',
  },
  {
    title: 'Silver',
    constant: 'SILVER',
    colorCode: '#E0E0E0',
  },
  {
    title: 'White',
    constant: 'WHITE',
    colorCode: '#fff',
  },
  {
    title: 'Gray',
    constant: 'GRAY',
    colorCode: '#9E9E9E',
  },
  {
    title: 'Red',
    constant: 'RED',
    colorCode: '#FF2F2F',
  },
  {
    title: 'Blue',
    constant: 'BLUE',
    colorCode: '#1C37C9',
  },
  {
    title: 'Gold',
    constant: 'GOLD',
    colorCode: '#BE9323',
  },
  {
    title: 'Orange',
    constant: 'ORANGE',
    colorCode: '#FF8C22',
  },
  {
    title: 'Green',
    constant: 'GREEN',
    colorCode: '#338E78',
  },
  {
    title: 'Brown',
    constant: 'BROWN',
    colorCode: '#8C2B2B',
  },
  {
    title: 'Other',
    constant: 'OTHER',
    colorCode: '',
  },
];

export const VEHICLE_INTERIOR_COLORS = [
  {
    title: 'Black',
    constant: 'BLACK',
    colorCode: '#000000',
  },
  {
    title: 'Dk gray',
    constant: 'DK GRAY',
    colorCode: '#a9a9a9',
  },
  {
    title: 'Lt gray',
    constant: 'LT GRAY',
    colorCode: '#d3d3d3',
  },
];

export const VEHICLE_FUEL_TYPE = [
  {
    title: 'Gas',
    type: 'Gasoline Fuel',
  },
  {
    title: 'Electric',
    type: 'Electric Fuel System',
  },
  {
    title: 'Hybrid',
    type: 'Plug-In Electric/Gas',
  },
  {
    title: 'Diesel',
    type: 'Diesel Fuel',
  },
];

export const VEHICLE_CYLINDER_AMOUNT = [
  {
    title: '4',
    type: '4 Cylinder Engine',
  },
  {
    title: '6',
    type: 'V6 Cylinder Engine',
  },
  {
    title: '8',
    type: '8 Cylinder Engine',
  },
  {
    title: 'Other',
    type: 'OTHER',
  },
];

export const VEHICLE_DRIVETRAIN_TYPE = [
  {
    type: 'Rear Wheel Drive',
  },
  {
    type: 'Front Wheel Drive',
  },
  {
    type: 'All Wheel Drive',
  },
];

export const RIDE_SHARE_TYPE = [
  {
    type: 'UBER BLACK',
  },
  {
    type: 'UBER COMFORT',
  },
  {
    type: 'UBER SUV',
  },
  {
    type: 'UBER X',
  },
  {
    type: 'UBER XL',
  },
];

export const PRIORITY_TABLE_RIDE_SHARE = {
  'UBER X': ['UBER SUV', 'UBER XL', 'UBER BLACK', 'UBER COMFORT', 'UBER X'],
  'UBER COMFORT': ['UBER SUV', 'UBER XL', 'UBER BLACK', 'UBER COMFORT'],
  'UBER BLACK': ['UBER SUV', 'UBER BLACK'],
  'UBER XL': ['UBER SUV', 'UBER XL'],
  'UBER SUV': ['UBER SUV'],
};

export const LIFESTYLE_TYPE = [
  {
    type: 'Deluxe Drive',
  },
  {
    type: 'Commuter`s Benefit',
  },
  {
    type: 'Family Owned',
  },
  {
    type: 'Almost New',
  },
  {
    type: 'Conscious Cars',
  },
  {
    type: 'Fabulously Fast',
  },
  {
    type: 'Convertible',
  },
  {
    type: 'Smart Purchase',
  },
  {
    type: 'Petite & Powerful',
  },
  {
    type: 'Spacious',
  },
];

export const SELECT_OPTIONS_USA_STATES = [
  {
    text: 'Alabama',
    value: 'AL',
  },
  {
    text: 'Alaska',
    value: 'AK',
  },
  {
    text: 'American Samoa',
    value: 'AS',
  },
  {
    text: 'Arizona',
    value: 'AZ',
  },
  {
    text: 'Arkansas',
    value: 'AR',
  },
  {
    text: 'California',
    value: 'CA',
  },
  {
    text: 'Colorado',
    value: 'CO',
  },
  {
    text: 'Connecticut',
    value: 'CT',
  },
  {
    text: 'Delaware',
    value: 'DE',
  },
  {
    text: 'District Of Columbia',
    value: 'DC',
  },
  {
    text: 'Federated States Of Micronesia',
    value: 'FM',
  },
  {
    text: 'Florida',
    value: 'FL',
  },
  {
    text: 'Georgia',
    value: 'GA',
  },
  {
    text: 'Guam',
    value: 'GU',
  },
  {
    text: 'Hawaii',
    value: 'HI',
  },
  {
    text: 'Idaho',
    value: 'ID',
  },
  {
    text: 'Illinois',
    value: 'IL',
  },
  {
    text: 'Indiana',
    value: 'IN',
  },
  {
    text: 'Iowa',
    value: 'IA',
  },
  {
    text: 'Kansas',
    value: 'KS',
  },
  {
    text: 'Kentucky',
    value: 'KY',
  },
  {
    text: 'Louisiana',
    value: 'LA',
  },
  {
    text: 'Maine',
    value: 'ME',
  },
  {
    text: 'Marshall Islands',
    value: 'MH',
  },
  {
    text: 'Maryland',
    value: 'MD',
  },
  {
    text: 'Massachusetts',
    value: 'MA',
  },
  {
    text: 'Michigan',
    value: 'MI',
  },
  {
    text: 'Minnesota',
    value: 'MN',
  },
  {
    text: 'Mississippi',
    value: 'MS',
  },
  {
    text: 'Missouri',
    value: 'MO',
  },
  {
    text: 'Montana',
    value: 'MT',
  },
  {
    text: 'Nebraska',
    value: 'NE',
  },
  {
    text: 'Nevada',
    value: 'NV',
  },
  {
    text: 'New Hampshire',
    value: 'NH',
  },
  {
    text: 'New Jersey',
    value: 'NJ',
  },
  {
    text: 'New Mexico',
    value: 'NM',
  },
  {
    text: 'New York',
    value: 'NY',
  },
  {
    text: 'North Carolina',
    value: 'NC',
  },
  {
    text: 'North Dakota',
    value: 'ND',
  },
  {
    text: 'Northern Mariana Islands',
    value: 'MP',
  },
  {
    text: 'Ohio',
    value: 'OH',
  },
  {
    text: 'Oklahoma',
    value: 'OK',
  },
  {
    text: 'Oregon',
    value: 'OR',
  },
  {
    text: 'Palau',
    value: 'PW',
  },
  {
    text: 'Pennsylvania',
    value: 'PA',
  },
  {
    text: 'Puerto Rico',
    value: 'PR',
  },
  {
    text: 'Rhode Island',
    value: 'RI',
  },
  {
    text: 'South Carolina',
    value: 'SC',
  },
  {
    text: 'South Dakota',
    value: 'SD',
  },
  {
    text: 'Tennessee',
    value: 'TN',
  },
  {
    text: 'Texas',
    value: 'TX',
  },
  {
    text: 'Utah',
    value: 'UT',
  },
  {
    text: 'Vermont',
    value: 'VT',
  },
  {
    text: 'Virgin Islands',
    value: 'VI',
  },
  {
    text: 'Virginia',
    value: 'VA',
  },
  {
    text: 'Washington',
    value: 'WA',
  },
  {
    text: 'West Virginia',
    value: 'WV',
  },
  {
    text: 'Wisconsin',
    value: 'WI',
  },
  {
    text: 'Wyoming',
    value: 'WY',
  },
];
export const CAR_REGISTER_USA_STATES = [
  {
    text: 'Alabama',
    value: 'AL',
  },
  {
    text: 'Alaska',
    value: 'AK',
  },
  {
    text: 'Arizona',
    value: 'AZ',
  },
  {
    text: 'Arkansas',
    value: 'AR',
  },
  {
    text: 'California',
    value: 'CA',
  },
  {
    text: 'Colorado',
    value: 'CO',
  },
  {
    text: 'Connecticut',
    value: 'CT',
  },
  {
    text: 'District Of Columbia',
    value: 'DC',
  },
  {
    text: 'Florida',
    value: 'FL',
  },
  {
    text: 'Georgia',
    value: 'GA',
  },
  {
    text: 'Idaho',
    value: 'ID',
  },
  {
    text: 'Illinois',
    value: 'IL',
  },
  {
    text: 'Indiana',
    value: 'IN',
  },
  {
    text: 'Iowa',
    value: 'IA',
  },
  {
    text: 'Kansas',
    value: 'KS',
  },
  {
    text: 'Kentucky',
    value: 'KY',
  },
  {
    text: 'Louisiana',
    value: 'LA',
  },
  {
    text: 'Maine',
    value: 'ME',
  },
  {
    text: 'Maryland',
    value: 'MD',
  },
  {
    text: 'Massachusetts',
    value: 'MA',
  },
  {
    text: 'Michigan',
    value: 'MI',
  },
  {
    text: 'Minnesota',
    value: 'MN',
  },
  {
    text: 'Mississippi',
    value: 'MS',
  },
  {
    text: 'Missouri',
    value: 'MO',
  },
  {
    text: 'North Carolina',
    value: 'NC',
  },
  {
    text: 'North Dakota',
    value: 'ND',
  },
  {
    text: 'Nebraska',
    value: 'NE',
  },
  {
    text: 'New Jersey',
    value: 'NJ',
  },
  {
    text: 'New Mexico',
    value: 'NM',
  },
  {
    text: 'Nevada',
    value: 'NV',
  },
  {
    text: 'New York',
    value: 'NY',
  },
  {
    text: 'Ohio',
    value: 'OH',
  },
  {
    text: 'Oklahoma',
    value: 'OK',
  },
  {
    text: 'Pennsylvania',
    value: 'PA',
  },
  {
    text: 'Rhode Island',
    value: 'RI',
  },
  {
    text: 'South Carolina',
    value: 'SC',
  },
  {
    text: 'South Dakota',
    value: 'SD',
  },
  {
    text: 'Tennessee',
    value: 'TN',
  },
  {
    text: 'Texas',
    value: 'TX',
  },
  {
    text: 'Utah',
    value: 'UT',
  },
  {
    text: 'Vermont',
    value: 'VT',
  },
  {
    text: 'Virginia',
    value: 'VA',
  },
  {
    text: 'Washington',
    value: 'WA',
  },
  {
    text: 'West Virginia',
    value: 'WV',
  },
  {
    text: 'Wisconsin',
    value: 'WI',
  },
  {
    text: 'Wyoming',
    value: 'WY',
  },
];

export const mainCategories = [
  {
    name: 'RIDE SHARE',
    categoryCover: '/static/images/car-race-438467_1920.jpg',
    subCategories: [
      {
        name: 'UBER BLACK',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/car-race-438467_1920.jpg',
      },
      {
        name: 'UBER SUV',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/car-race-438467_1920.jpg',
      },
      {
        name: 'UBER X',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/car-race-438467_1920.jpg',
      },
      {
        name: 'UBER XL',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/car-race-438467_1920.jpg',
      },
    ],
    categoryDescription: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
  },
  {
    name: 'Life Style',
    categoryCover: '/static/images/bmw-918408_1920.jpg',
    subCategories: [
      {
        name: 'Deluxe Drive',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Commuter`s Benefit',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Family Owned',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Almost New',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Tech Genius',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Conscious Cars',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Fabulously Fast',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Convertible ',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Smart Purchase',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Petite & Powerful',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
      {
        name: 'Spacious',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/bmw-918408_1920.jpg',
      },
    ],
    categoryDescription: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
  },
  {
    name: 'Body Type',
    categoryCover: '/static/images/aston-2118857_1920.jpg',
    subCategories: [
      {
        name: 'Sedan',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/aston-2118857_1920.jpg',
      },
      {
        name: 'Truck',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/aston-2118857_1920.jpg',
      },
      {
        name: 'Mini Van',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/aston-2118857_1920.jpg',
      },
      {
        name: 'SUV',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/aston-2118857_1920.jpg',
      },
      {
        name: 'Hatch',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/aston-2118857_1920.jpg',
      },
      {
        name: 'Van',
        description: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
        categoryCover: '/static/images/aston-2118857_1920.jpg',
      },
    ],
    categoryDescription: 'RIDESHARE READY RENTALS. ONLY THE BEST. GUARANTEED.',
  },
];

export const STANDARD_FEATURE_TYPE = [
  {
    type: 'Blind Spot Sensors',
  },
  {
    type: 'BlueTooth',
  },
  {
    type: 'Fog Lights',
  },
  {
    type: 'GPS Navigation',
  },
  {
    type: 'Heated Seats',
  },
  {
    type: 'Heated Side Mirrors',
  },
  {
    type: 'Keyless Entry',
  },
  {
    type: '4G / WiFi',
  },
  {
    type: 'Parking Sensors / Assist',
  },
  {
    type: 'Premium Sound',
  },
  {
    type: 'Push Button Starting',
  },
  {
    type: 'Rear View Camera',
  },
  {
    type: 'Satellite Radio',
  },
  {
    type: 'Side-Impact Safety',
  },
  {
    type: 'Sunroof / Moonroof',
  },
  {
    type: 'USB Connectivity',
  },
];

export const GTM_ID = 'GTM-NC7CQ69';

export const PRIVATE_PLATE = 'PRIVATE PLATE';
export const VIDEOS_STRUCTURED_DATA = JSON.stringify([
  {
    '@context': 'https://schema.org/',
    '@type': 'VideoObject',
    uploadDate: '2023-01-04T12:00:00Z',
    contentUrl: 'https://vimeo.com/485260119/8a2d4c9399',
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: {
        '@type': 'http://schema.org/WatchAction',
      },
      userInteractionCount: 'Number of views or interactions for Overview',
    },
  },
  {
    '@context': 'https://schema.org/',
    '@type': 'VideoObject',
    uploadDate: '2023-01-05T12:00:00Z',
    contentUrl: 'https://vimeo.com/485259705/99ff7d2dcc',
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: {
        '@type': 'http://schema.org/WatchAction',
      },
      userInteractionCount: 'Number of views or interactions for Purchase',
    },
  },
  {
    '@context': 'https://schema.org/',
    '@type': 'VideoObject',
    uploadDate: '2023-01-05T12:00:00Z',
    contentUrl: 'https://vimeo.com/485259508/d6b9c744cc',
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: {
        '@type': 'http://schema.org/WatchAction',
      },
      userInteractionCount: 'Number of views or interactions for RideShare',
    },
  },
]);
