import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// 1. .env 파일에 저장된 환경 변수(API Key)를 불러옵니다.
dotenv.config();

const app = express();
const port = 3000;

// 2. 구글 제미나이 AI 클라이언트를 초기화합니다.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 브라우저나 프론트엔드에서 '/api/analyze-geo'로 요청하면 이 주소가 실행됩니다.
app.get('/api/analyze-geo', async (req, res) => {
    try {
        // [1단계] 깃허브에서 실제 tour.geojson 데이터 다운로드하기 (Raw URL 사용)
        const githubRawUrl = 'https://raw.githubusercontent.com/koostar85/tour/main/tour.geojson';
        
        console.log('GitHub에서 GeoJSON 데이터를 가져오는 중...');
        const geoResponse = await fetch(githubRawUrl);
        
        if (!geoResponse.ok) {
            throw new Error(`GitHub 데이터를 가져오는데 실패했습니다. 상태 코드: ${geoResponse.status}`);
        }
        
        const geoJsonData = await geoResponse.json();

        // [2단계] Gemini API에게 분석 요청 (데이터를 문자열로 변환하여 프롬프트에 동봉)
        console.log('Gemini AI에게 분석을 요청하는 중...');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // 가성비와 속도가 뛰어난 표준 모델
            contents: [
                { 
                    text: `너는 공간 데이터 분석가야. 다음 제공하는 GeoJSON 데이터(대한민국 여행/관광 관련 데이터)를 분석해서 어떤 데이터인지 요약하고, 데이터의 공간적 특징이나 주목할 만한 점을 한국어로 친절하게 설명해줘: ${JSON.stringify(geoJsonData)}` 
                }
            ],
        });

        // [3단계] Gemini의 답변 내용을 브라우저(클라이언트)로 전송
        console.log('분석 완료! 결과를 반환합니다.');
        res.json({ 
            success: true,
            result: response.text 
        });

    } catch (error) {
        console.error('에러 발생:', error.message);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// 서버 가동
app.listen(port, () => {
    console.log(`==================================================`);
    console.log(` 서버가 성공적으로 작동 중입니다!`);
    console.log(` 포트 탭을 확인하거나 주소 뒤에 /api/analyze-geo 를 붙여서 확인하세요.`);
    console.log(`==================================================`);
});
