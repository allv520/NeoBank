// scoring-service.js
// Общая логика: пробуем ML, при ошибке — fallback на аддитивную свёртку.
const { calculateInterestRateML } = require('./ml-scoring');
const calculateInterestRateAdditive = require('./scoring');

const USE_ML = process.env.USE_ML_SCORING === 'true';

async function getInterestRate(userId) {
    if (!USE_ML) {
        console.log(`[scoring] ML отключён, используем аддитивную свёртку для user ${userId}`);
        return await calculateInterestRateAdditive(userId);
    }

    try {
        const rate = await calculateInterestRateML(userId);
        console.log(`[scoring] ML-модель вернула ставку ${rate}% для user ${userId}`);
        return rate;
    } catch (err) {
        console.warn(`[scoring] ML недоступен (${err.message}), fallback на аддитивную свёртку`);
        return await calculateInterestRateAdditive(userId);
    }
}

module.exports = { getInterestRate };