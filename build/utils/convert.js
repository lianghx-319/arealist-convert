const mobileModel = {
  province: "province_list",
  city: "city_list",
  county: "county_list"
}

const pcModel = {
  province: "provinceList",
  city: "cityList",
  county: "countyList"
}

const pattern = {
  city: {
    zero: "0000",
    reg: /\d{4}$/
  },
  county: {
    zero: "00",
    reg: /\d{2}$/
  }
}

function matchCode(type) {
  return function(a, b) {
    const t = pattern[type]
    return a == b.replace(t.reg, t.zero)
  }
}

const matchCityCode = matchCode("city")
const matchCountyCode = matchCode("county")

const isObject = value => Object.prototype.toString.call(value) === "[object Object]"

module.exports = function(mobileArea = {}) {
  let pcProvice, pcCity, pcCounty

  const mobileProvince = mobileArea[mobileModel.province]
  const mobileCity = mobileArea[mobileModel.city]
  const mobileCounty = mobileArea[mobileModel.county]

  // init pc area list
  pcProvice = Object.assign({}, mobileProvince)
  pcCity = Object.assign({}, mobileProvince)
  pcCounty = Object.assign({}, mobileCity)

  for (let provinceCode in mobileProvince) {
    for (let cityCode in mobileCity) {
      if (matchCityCode(provinceCode, cityCode)) {
        isObject(pcCity[provinceCode]) || (pcCity[provinceCode] = {})
        pcCity[provinceCode][cityCode] = mobileCity[cityCode]
      }
      for (let countyCode in mobileCounty) {
        if (matchCountyCode(cityCode, countyCode)) {
          isObject(pcCounty[cityCode]) || (pcCounty[cityCode] = {})
          pcCounty[cityCode][countyCode] = mobileCounty[countyCode]
        }
      }
    }
  }

  return {
    [pcModel.province]: pcProvice,
    [pcModel.city]: pcCity,
    [pcModel.county]: pcCounty
  }
}