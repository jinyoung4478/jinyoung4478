const request = require('request');

const url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';


const base_date = '20230427';

const api_url =
   url +
   '?serviceKey=' +
   key +
   '&numOfRows=1&pageNo=1&dataType=JSON&base_date=' +
   base_date +
   '&base_time=0600&nx=57&ny=126';

request(api_url, function (err, res, body) {
   console.log(res.body);
});

// const testRes = {
//    response: {
//       header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
//       body: {
//          dataType: 'JSON',
//          items: {
//             item: [{ baseDate: '20230427', baseTime: '0600', category: 'PTY', nx: 55, ny: 127, obsrValue: '0' }],
//          },
//          pageNo: 1,
//          numOfRows: 1,
//          totalCount: 8,
//       },
//    },
// };
