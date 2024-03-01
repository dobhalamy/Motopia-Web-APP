import AccidentIcon from 'assets/vehicle/accident';
import UserIcon from 'assets/vehicle/user';
import TitleInformationIcon from 'assets/vehicle/titleInformation';
import UsageTypeIcon from 'assets/vehicle/usageType';

export const CIRCLE_RADIUS = 20;

export const PIN_SHAPE = 'circle';

export const SCALABILITY_INDEX = 0.673;

export const VEHICLE_PAGE_WIDTH = 1200;
export const VEHICLE_CONTENT_WIDTH = 880;
export const DRAWER_WIDTH = 350;

export const SUMMARY_FIELDS = [
  {
    title: 'List Price:',
    fieldName: 'listPrice',
    isMoneyValue: true,
    withNumberFormatting: true,
  },
  {
    title: 'Mileage:',
    fieldName: 'mileage',
    titleExtension: ' miles',
    withNumberFormatting: true,
  },
  {
    title: 'Ext. Color:',
    fieldName: 'exteriorColor',
  },
  {
    title: 'Int. Color:',
    fieldName: 'interiorColor',
  },
  {
    title: 'Engine:',
    fieldName: 'fuelType',
  },
  {
    title: 'Drive Type:',
    fieldName: 'driveType',
  },
  {
    title: 'Transmission:',
    fieldName: 'transmission',
  },
  {
    title: 'VIN#:',
    fieldName: 'vin',
  },
  {
    title: 'Stock#:',
    fieldName: 'stockid',
  },
  {
    title: 'Seating',
    fieldName: 'seating',
    titleExtension: ' passengers',
  },
  {
    title: 'Carfax Highlights:',
    fieldName: 'highlights',
  },
  {
    title: 'Carfax Report:',
    fieldName: 'carfaxReport',
  },
];

export const LUXURY_FEATURES = [
  'Climate Control System',
  'Dual Zone Electronic Climate Control System',
  'Front Heated Seats',
  'Heated Mirrors',
  'Leather Steering Wheel',
  'Memory Seat Position',
  'Moonroof',
  'Remote Trunk Lid',
  'Steering Wheel Radio Controls',
  'Telescoping Steering Wheel',
  'Tire Pressure Monitor',
];

export const SAFETY_FEATURES = [
  'Child Proof Door Locks',
  'Daytime Running Lights',
  'Driver\'s Air Bag',
  'Intermittent Wipers',
  'Passenger Air Bag',
  'Rear Defogger',
  'Roll Stability Control',
  'Security System',
  'Side Air Bags',
  'Side Curtain Airbags',
];

export const POWER_EQUIPMENT = [
  'Power Driver\'s Seat',
  'Power Mirrors',
  'Power Steering',
];

export const EXTERIOR = ['Remote Fuel Door', 'Sunroof'];

export const VEHICLE_HISTORY_OPTIONS = [
  {
    title: 'One Owner',
    description: 'This vehicle has 1 reported owner.',
    iconName: UserIcon,
  },
  {
    title: 'Usage Type Not Provided',
    description: 'Accident information was not provided.',
    iconName: UsageTypeIcon,
  },
  {
    title: 'Accident Data Not Provided',
    description: 'This vehicle has 1 reported owner.',
    iconName: AccidentIcon,
  },
  {
    title: 'Title Information Not Provided ',
    description: 'Information about title/damage issues were not provided.',
    iconName: TitleInformationIcon,
  },
];
