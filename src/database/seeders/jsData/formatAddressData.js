"use strict";
exports.__esModule = true;
var fs = require("fs");
var results =[
        {
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "Lê Văn Thứ",
                    "short_name": "Lê Văn Thứ",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "Mân Thái",
                    "short_name": "Mân Thái",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Sơn Trà",
                    "short_name": "Sơn Trà",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 Lê Văn Thứ, Mân Thái, Sơn Trà, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.085115,
                    "lng": 108.2453
                }
            },
            "place_id": "ek_address:address:1075978",
            "types": [
                "street_address"
            ]
        },
        {
            "name": "75 Hoàng Văn Thụ",
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "Hoàng Văn Thụ",
                    "short_name": "Hoàng Văn Thụ",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "Phước Ninh",
                    "short_name": "Phước Ninh",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Hải Châu",
                    "short_name": "Hải Châu",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 Hoàng Văn Thụ, Phước Ninh, Hải Châu, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.062574,
                    "lng": 108.220948
                }
            },
            "place_id": "openstreetmap:address:node/5200280921",
            "types": [
                "street_address"
            ]
        },
        {
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "Hoàng Văn Thụ",
                    "short_name": "Hoàng Văn Thụ",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "Phước Ninh",
                    "short_name": "Phước Ninh",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Hải Châu",
                    "short_name": "Hải Châu",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 Hoàng Văn Thụ, Phước Ninh, Hải Châu, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.062833,
                    "lng": 108.220938
                }
            },
            "place_id": "ek_address_mbw:address:57904",
            "types": [
                "street_address"
            ]
        },
        {
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "MẸ THỨ",
                    "short_name": "MẸ THỨ",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "Hòa Xuân",
                    "short_name": "Hòa Xuân",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Cẩm Lệ",
                    "short_name": "Cẩm Lệ",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 MẸ THỨ, Hòa Xuân, Cẩm Lệ, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.001463,
                    "lng": 108.22144
                }
            },
            "place_id": "ek_address:address:1101386",
            "types": [
                "street_address"
            ]
        },
        {
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "Thủ Khoa Huân",
                    "short_name": "Thủ Khoa Huân",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "An Hải Đông",
                    "short_name": "An Hải Đông",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Sơn Trà",
                    "short_name": "Sơn Trà",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 Thủ Khoa Huân, An Hải Đông, Sơn Trà, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.055817,
                    "lng": 108.241646
                }
            },
            "place_id": "ek_address:address:1084091",
            "types": [
                "street_address"
            ]
        },
        {
            "name": "75 Đường Lê Văn Thứ",
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "Đường Lê Văn Thứ",
                    "short_name": "Đường Lê Văn Thứ",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "Mân Thái",
                    "short_name": "Mân Thái",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Sơn Trà",
                    "short_name": "Sơn Trà",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 Đường Lê Văn Thứ, Mân Thái, Sơn Trà, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.085293,
                    "lng": 108.244221
                }
            },
            "place_id": "openstreetmap:address:node/6506697561",
            "types": [
                "street_address"
            ]
        },
        {
            "address_components": [
                {
                    "long_name": "75",
                    "short_name": "75",
                    "types": [
                        "street_number"
                    ]
                },
                {
                    "long_name": "Lê Văn Thủ",
                    "short_name": "Lê Văn Thủ",
                    "types": [
                        "route"
                    ]
                },
                {
                    "long_name": "Khuê Mỹ",
                    "short_name": "Khuê Mỹ",
                    "types": [
                        "administrative_area_level_3",
                        "locality",
                        "political"
                    ]
                },
                {
                    "long_name": "Ngũ Hành Sơn",
                    "short_name": "Ngũ Hành Sơn",
                    "types": [
                        "administrative_area_level_2",
                        "political"
                    ]
                },
                {
                    "long_name": "Đà Nẵng",
                    "short_name": "Đà Nẵng",
                    "types": [
                        "administrative_area_level_1",
                        "political"
                    ]
                }
            ],
            "formatted_address": "75 Lê Văn Thủ, Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng",
            "geometry": {
                "location": {
                    "lat": 16.03101,
                    "lng": 108.24073
                }
            },
            "place_id": "ek_address:address:1087574",
            "types": [
                "street_address"
            ]
        }
    ]
var formattedAddress = results.map(function (el) {
    var splitted = el.formatted_address.split(',');
    return {
        street: splitted[0],
        district: "Qu\u1EADn ".concat(splitted[splitted.length - 2].trim()),
        city: splitted[splitted.length - 1].trim(),
        lat: el.geometry.location.lat,
        long: el.geometry.location.lng
    };
});
console.log(formattedAddress);
var filePath = './vietnamAddress.json';
// Write to the JSON file
fs.writeFile(filePath, JSON.stringify(formattedAddress), 'utf-8', function (err) {
    if (err) {
        console.error('Error writing to file:', err);
    }
    else {
        console.log('Data has been written to the file successfully.');
    }
});


