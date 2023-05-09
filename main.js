require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
moment.locale('ko');

// - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
const precipitationStateList = {
   0: '비소식은 없어요 ☀️',
   1: '지금 비가와요 🌧️',
   2: '눈비가 내려요 🌨️',
   3: '눈이 오고있어요 ❄️',
   5: '빗방울이 떨어져요',
   6: '진눈깨비가 와요 🌧️',
   7: '눈발이 날려요 ❄️',
};

const skyStateList = {
   1: '화창하고',
   3: '구름 많고',
   4: '흐리고',
};

const dayFeelingList = {
   월요일: '힘찬 월요일을 응원합니다 💪',
   화요일: '활짝 웃는 화요일되세요 😁',
   수요일: '수많은 즐거움 가득하세요 😎',
   목요일: '목요일 조금만 더 힘내봅시다! 🫡',
   금요일: '불타는 금요일을...!',
   토요일: '이번 주말 잘 보내세요! 🏝️',
   일요일: '푹 쉬세... 혹시 내일 출근..? 🤭',
};

// 현재 날짜
const todayDate = moment().format('YYYYMMDD');

// API KEY
const serviceKey = process.env.API_KEY;

// 초단기실황조회
// const endpoint = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
// 초단기예보조회
const endpoint = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';

// 요청할 API URL
const api_url = `${endpoint}?serviceKey=${serviceKey}`;

// 지역: 서울특별시 발산제1동
const nx = 57;
const ny = 126;

async function getTodayWeatherState() {
   return axios
      .get(api_url, {
         params: {
            serviceKey,
            numOfRows: 1000,
            pageNo: 1,
            dataType: 'JSON',
            base_date: todayDate,
            base_time: '0600',
            nx,
            ny,
         },
      })
      .then(res => {
         const data = res.data.response.body.items.item;
         return data;
      });
}

async function buildSvg() {
   // 일기 예보 수집
   const todayWeatherState = await getTodayWeatherState();

   // 기온
   const tmp = todayWeatherState.filter(item => item.category === 'T1H').pop().fcstValue;
   // 하늘 상태
   const sky = todayWeatherState.filter(item => item.category === 'SKY').pop().fcstValue;
   // 강수형태
   const pty = todayWeatherState.filter(item => item.category === 'PTY').pop().fcstValue;

   // 오늘의 요일
   const todayDay = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' }).format(new Date());

   fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
         return;
      }
      data = data.replace('{tmp}', tmp);
      data = data.replace('{skyState}', skyStateList[sky]);
      data = data.replace('{precipitationState}', precipitationStateList[pty]);
      data = data.replace('{sayBye}', dayFeelingList[todayDay]);

      data = fs.writeFile('chat.svg', data, err => {
         if (err) {
            console.error(err);
            return;
         }
      });
   });
}

buildSvg();

// 초단기예보
// T1H	기온	℃	10
// RN1	1시간 강수량	범주 (1 mm)	8
// SKY	하늘상태	코드값	4
// UUU	동서바람성분	m/s	12
// VVV	남북바람성분	m/s	12
// REH	습도	%	8
// PTY	강수형태	코드값	4
// LGT	낙뢰	kA(킬로암페어)	4
// VEC	풍향	deg	10
// WSD	풍속	m/s	10

// - 하늘상태(SKY) 코드: 맑음(1), 구름많음(3), 흐림(4)

// - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
