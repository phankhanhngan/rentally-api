import * as fs from 'fs';
const results = [
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Lai',
        short_name: 'Lê Lai',
        types: ['route'],
      },
      {
        long_name: 'Thạch Thang',
        short_name: 'Thạch Thang',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Hải Châu',
        short_name: 'Hải Châu',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Lai, Thạch Thang, Hải Châu, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.075532,
        lng: 108.21884,
      },
    },
    place_id: 'ek_address_mbw:address:181617',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Lai',
        short_name: 'Lê Lai',
        types: ['route'],
      },
      {
        long_name: 'Thạch Thang',
        short_name: 'Thạch Thang',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Hải Châu',
        short_name: 'Hải Châu',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Lai, Thạch Thang, Hải Châu, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.075548,
        lng: 108.219055,
      },
    },
    place_id: 'ek_address:address:1047463',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Bôi',
        short_name: 'Lê Bôi',
        types: ['route'],
      },
      {
        long_name: 'Mân Thái',
        short_name: 'Mân Thái',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Sơn Trà',
        short_name: 'Sơn Trà',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Bôi, Mân Thái, Sơn Trà, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.084578,
        lng: 108.24657,
      },
    },
    place_id: 'ek_address:address:1075935',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Duẩn',
        short_name: 'Lê Duẩn',
        types: ['route'],
      },
      {
        long_name: 'Hải Châu I',
        short_name: 'Hải Châu I',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Hải Châu',
        short_name: 'Hải Châu',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Duẩn, Hải Châu I, Hải Châu, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.07163,
        lng: 108.222198,
      },
    },
    place_id: 'ek_address_mbw:address:357212',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Hữu Kiều',
        short_name: 'Lê Hữu Kiều',
        types: ['route'],
      },
      {
        long_name: 'Nại Hiên Đông',
        short_name: 'Nại Hiên Đông',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Sơn Trà',
        short_name: 'Sơn Trà',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Hữu Kiều, Nại Hiên Đông, Sơn Trà, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.09608,
        lng: 108.2306,
      },
    },
    place_id: 'ek_address:address:1072968',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Cảnh Tuân',
        short_name: 'Lê Cảnh Tuân',
        types: ['route'],
      },
      {
        long_name: 'Nại Hiên Đông',
        short_name: 'Nại Hiên Đông',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Sơn Trà',
        short_name: 'Sơn Trà',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Cảnh Tuân, Nại Hiên Đông, Sơn Trà, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.09539,
        lng: 108.2318,
      },
    },
    place_id: 'ek_address:address:1068420',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Khôi',
        short_name: 'Lê Khôi',
        types: ['route'],
      },
      {
        long_name: 'Hòa Cường Bắc',
        short_name: 'Hòa Cường Bắc',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Hải Châu',
        short_name: 'Hải Châu',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Khôi, Hòa Cường Bắc, Hải Châu, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.041857,
        lng: 108.21188,
      },
    },
    place_id: 'ek_address:address:1059379',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Tấn Trung',
        short_name: 'Lê Tấn Trung',
        types: ['route'],
      },
      {
        long_name: 'Thọ Quang',
        short_name: 'Thọ Quang',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Sơn Trà',
        short_name: 'Sơn Trà',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Tấn Trung, Thọ Quang, Sơn Trà, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.099611,
        lng: 108.24898,
      },
    },
    place_id: 'ek_address:address:1071818',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Tấn Trung',
        short_name: 'Lê Tấn Trung',
        types: ['route'],
      },
      {
        long_name: 'Thọ Quang',
        short_name: 'Thọ Quang',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Sơn Trà',
        short_name: 'Sơn Trà',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Tấn Trung, Thọ Quang, Sơn Trà, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.099024,
        lng: 108.249535,
      },
    },
    place_id: 'ek_address:address:1071750',
    types: ['street_address'],
  },
  {
    address_components: [
      {
        long_name: '20',
        short_name: '20',
        types: ['street_number'],
      },
      {
        long_name: 'Lê Cơ',
        short_name: 'Lê Cơ',
        types: ['route'],
      },
      {
        long_name: 'Hòa Cường Bắc',
        short_name: 'Hòa Cường Bắc',
        types: ['administrative_area_level_3', 'locality', 'political'],
      },
      {
        long_name: 'Hải Châu',
        short_name: 'Hải Châu',
        types: ['administrative_area_level_2', 'political'],
      },
      {
        long_name: 'Đà Nẵng',
        short_name: 'Đà Nẵng',
        types: ['administrative_area_level_1', 'political'],
      },
    ],
    formatted_address: '20 Lê Cơ, Hòa Cường Bắc, Hải Châu, Đà Nẵng',
    geometry: {
      location: {
        lat: 16.042812,
        lng: 108.219864,
      },
    },
    place_id: 'ek_address:address:1060184',
    types: ['street_address'],
  },
];

const formattedAddress = results.map((el) => {
  const splitted = el.formatted_address.split(',');
  return {
    street: splitted[0],
    district: `Quận ${splitted[splitted.length - 2].trim()}`,
    city: splitted[splitted.length - 1].trim(),
    lat: el.geometry.location.lat,
    long: el.geometry.location.lng,
  };
});
console.log(formattedAddress);
const filePath = './vietnamAddress.json';

// Write to the JSON file
fs.writeFile(filePath, JSON.stringify(formattedAddress), 'utf-8', (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log('Data has been written to the file successfully.');
  }
});
