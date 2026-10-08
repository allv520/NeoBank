// ml-scoring.js
// Обёртка над ML-сервисом (FastAPI). Обращается к http://localhost:8000/predict
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

async function collectFeatures(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            cards: { where: { isBlocked: false }, select: { id: true } },
            credits: true
        }
    });

    if (!user) throw new Error('Пользователь не найден');

    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const transactions = await prisma.transaction.findMany({
        where: {
            card: { userId },
            date: { gte: threeMonthsAgo }
        },
        select: { amount: true, type: true }
    });

    const income = transactions
        .filter(t => t.type === 'plus')
        .reduce((sum, t) => sum + t.amount, 0) / 3;

    const expense = transactions
        .filter(t => t.type === 'minus')
        .reduce((sum, t) => sum + t.amount, 0) / 3;

    const debtRatio = income > 0 ? expense / income : 1.0;
    const balance = user.balance;
    const activeCards = user.cards.length;
    const daysOnPlatform = Math.floor((now - user.createdAt) / (1000 * 60 * 60 * 24));
    const closedCredits = user.credits.filter(c => c.status === 'closed').length;
    const hasOverdue = user.credits.some(c => c.penalty > 0 || c.status === 'overdue') ? 1 : 0;

    return {
        income: Math.round(income * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        debt_ratio: Math.round(debtRatio * 1000) / 1000,
        balance: Math.round(balance * 100) / 100,
        active_cards: activeCards,
        days_on_platform: daysOnPlatform,
        closed_credits: closedCredits,
        has_overdue: hasOverdue
    };
}

async function calculateInterestRateML(userId) {
    const features = await collectFeatures(userId);

    const response = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        features,
        { timeout: 3000 }
    );

    return response.data.rate;
}

module.exports = { calculateInterestRateML, collectFeatures };