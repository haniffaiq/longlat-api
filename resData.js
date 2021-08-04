import mysql from 'mysql2';
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'petani',
    multipleStatements: true
});

const addZones = (resultArray)=>{
  var arrFarm = []
  
  for(let i = 0; i < resultArray.length; i++){
    if (arrFarm.find(item => item.code_farm == resultArray[i].code_farm)) {
      let idx = arrFarm.findIndex(item => item.code_farm == resultArray[i].code_farm);
      arrFarm[idx].zone = [
        ...arrFarm[idx].zone,
        {
          area: resultArray[i].area,
          length: resultArray[i].length,
          number_zone: resultArray[i].number_zone,
          latitude_area: resultArray[i].latitude_area,
          longitude_area: resultArray[i].longitude_area
        }
      ]
    } else {
      arrFarm.push({
        name: resultArray[i].name,
        farmer_name: resultArray[i].first_name +  resultArray[i].last_name,
        phone: resultArray[i].phone,
        code_farm: resultArray[i].code_farm,
        zone: [{
          area: resultArray[i].area,
          length: resultArray[i].length,
          number_zone: resultArray[i].number_zone,
          latitude_area: resultArray[i].latitude_area,
          longitude_area: resultArray[i].longitude_area
        }]
      })
    }
  }

  return arrFarm;
}

const processing = async (req, res) => {


  var role = req.params.role
  var codeFarm = req.params.codeFarm
  let seeDataQuery = `select * from users`;
  let joinDataQuery = `SELECT farms.name, farms.code_farm, farms.phone, farms.latitude as latitude_point, farms.longitude as longitude_point, detail_farms.farmers_id, users.first_name, users.last_name, zones.area,zones.length, zones.number_zone, detail_zones.latitude as latitude_area, detail_zones.longitude as longitude_area
                  FROM farms
                  INNER JOIN detail_farms ON detail_farms.farms_id = farms.id
                  INNER JOIN users ON users.id = detail_farms.users_id
                  INNER JOIN zones ON zones.farms_id = farms.id
                  INNER JOIN detail_zones ON detail_zones.zones_id = zones.id
                  `;
  let joinDataOwnerQuery = `SELECT farms.name, farms.code_farm, farms.phone, farms.latitude as latitude_point, farms.longitude as longitude_point, detail_farms.farmers_id, users.first_name, users.last_name, zones.area,zones.length, zones.number_zone, detail_zones.latitude as latitude_area, detail_zones.longitude as longitude_area
                  FROM farms
                  INNER JOIN detail_farms ON detail_farms.farms_id = farms.id
                  INNER JOIN users ON users.id = detail_farms.farmers_id
                  INNER JOIN zones ON zones.farms_id = farms.id
                  INNER JOIN detail_zones ON detail_zones.zones_id = zones.id
                  where code_farm = ?`;

  // get the client
  const promisePool = pool.promise();
  // query database using promises
  const seeData = await promisePool.query(seeDataQuery);
  const joinData = await promisePool.query(joinDataQuery);
  const joinDataOwner = await promisePool.query(joinDataOwnerQuery, [req.params.codeFarm]);
  var hasil
  if(role == '1' && codeFarm == "all"){
    hasil = addZones(joinData[0])
  }

  else{
    hasil = addZones(joinDataOwner[0])
  }

  console.log(hasil);
  res.status(200).json(hasil);
  
}

export {
  processing
};