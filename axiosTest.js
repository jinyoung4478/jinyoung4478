const axios = require('axios');


const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${serviceKey}`;

const base_date = '20230427';

const nx = 57;
const ny = 126;

const res = axios
   .get(url, {
      params: {
         serviceKey,
         numOfRows: 1,
         pageNo: 1,
         dataType: 'JSON',
         base_date,
         base_time: '0600',
         nx,
         ny,
      },
   })
   .then(res => {
      const result = res.data.response.body;
      console.log(result);
      console.log(result.items);
   });

//    - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
//                       (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
