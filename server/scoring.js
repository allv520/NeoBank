// scoring.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Рассчитывает индивидуальную процентную ставку для пользователя.
 * @param {number} userId
 * @returns {Promise<number>} Процентная ставка (годовых, например 12.5)
 */
async function calculateInterestRate(userId) {
  // Получаем данные пользователя и его кредитную историю
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cards: {
        where: { isBlocked: false },
        select: { id: true }
      },
      credits: true
    }
  });

  if (!user) throw new Error('Пользователь не найден');

  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // Транзакции за последние 3 месяца
  const transactions = await prisma.transaction.findMany({
    where: {
      card: { userId },
      date: { gte: threeMonthsAgo }
    },
    select: { amount: true, type: true }
  });

  // Среднемесячный доход и расход
  const income = transactions
    .filter(t => t.type === 'plus')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const expense = transactions
    .filter(t => t.type === 'minus')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const debtRatio = income > 0 ? expense / income : 1; // отношение расходов к доходам

  // Другие критерии
  const balance = user.balance;
  const activeCardsCount = user.cards.length;
  const daysOnPlatform = Math.floor((now - user.createdAt) / (1000 * 60 * 60 * 24));

  const closedCredits = user.credits.filter(c => c.status === 'closed').length;
  const hasOverdue = user.credits.some(c => c.penalty > 0 || c.status === 'overdue');

  // Максимальные значения по выборке (для нормализации)
  const [maxIncome, maxExpense, maxBalance, maxDays] = await Promise.all([
    prisma.transaction.aggregate({
      _max: { amount: true },
      where: { type: 'plus' }
    }),
    prisma.transaction.aggregate({
      _max: { amount: true },
      where: { type: 'minus' }
    }),
    prisma.user.aggregate({ _max: { balance: true } }),
    prisma.user.aggregate({
      _max: { createdAt: true }
    }).then(res => {
      const oldest = res._max.createdAt;
      if (!oldest) return 0;
      return Math.floor((now - oldest) / (1000 * 60 * 60 * 24));
    })
  ]);

  const maxIncomeVal = maxIncome._max.amount || 1;
  const maxExpenseVal = maxExpense._max.amount || 1;
  const maxBalanceVal = maxBalance._max.balance || 1;
  const maxDaysVal = maxDays || 1;

  //Нормализация (значения приводятся к отрезку [0, 1])
  const normIncome = Math.min(income / maxIncomeVal, 1);
  const normExpense = 1 - Math.min(expense / maxExpenseVal, 1);
  const normDebtRatio = 1 - Math.min(debtRatio, 1);
  const normBalance = Math.min(balance / maxBalanceVal, 1);
  const normActiveCards = Math.min(activeCardsCount / 5, 1); // предполагаем максимум 5 карт
  const normDays = Math.min(daysOnPlatform / maxDaysVal, 1);
  const normClosedCredits = Math.min(closedCredits / 3, 1); // максимум 3 погашенных кредита
  const normOverdue = hasOverdue ? 0 : 1;

  // Веса критериев
  const weights = {
    income: 1.5,
    expense: 0.8,
    debtRatio: 1.2,
    balance: 1.0,
    activeCards: 0.5,
    days: 0.7,
    closedCredits: 1.0,
    overdue: 1.3
  };

  //Итоговый скоринговый балл
  const score =
    weights.income * normIncome +
    weights.expense * normExpense +
    weights.debtRatio * normDebtRatio +
    weights.balance * normBalance +
    weights.activeCards * normActiveCards +
    weights.days * normDays +
    weights.closedCredits * normClosedCredits +
    weights.overdue * normOverdue;

  const maxScore = Object.values(weights).reduce((a, b) => a + b, 0); // 8.0

  // Преобразуем балл в процентную ставку (от 5% до 25%)
  const minRate = 5;
  const maxRate = 25;
  const rate = minRate + (1 - score / maxScore) * (maxRate - minRate);

  // Округляем до двух знаков и возвращаем
  return Math.round(rate * 100) / 100;
}

module.exports = calculateInterestRate;