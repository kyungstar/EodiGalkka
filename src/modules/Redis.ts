import Redis from 'ioredis';

// Redis 클라이언트 인스턴스 생성
const redisClient = new Redis({
    host: 'localhost', // Redis 서버 호스트
    port: 6379, // Redis 서버 포트
    password: 'your_password', // Redis 인증 비밀번호 (선택적)
});

// Redis 연결 확인
redisClient.on('connect', () => {
    console.log('Redis connected');
});

// Redis 연결 실패 시 처리
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;
