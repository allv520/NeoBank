require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// Подключаем модуль скоринга
const calculateInterestRate = require('./scoring');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Вспомогательные функции
const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (!decoded.isAdmin) return res.sendStatus(403);
    req.admin = decoded;
    next();
  });
};

// Получение первой активной карты пользователя (для транзакций без карты)
async function getFirstActiveCardId(userId) {
  const card = await prisma.card.findFirst({
    where: { userId, isBlocked: false },
    select: { id: true }
  });
  return card?.id || null;
}

// Регистрация и авторизация
app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName, phone, avatar } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Пользователь с таким email уже существует' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const cardNumber = '4455' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
    if (!userRole) return res.status(500).json({ message: 'Роль USER не найдена' });

    const virtualType = await prisma.cardType.findUnique({ where: { name: 'VIRTUAL' } });
    if (!virtualType) return res.status(500).json({ message: 'Тип карты VIRTUAL не найден' });

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName: lastName || null,
        phone,
        avatar,
        roleId: userRole.id,
        balance: 0.0,
        cards: {
          create: {
            cardNumber,
            expiry: '12/28',
            typeId: virtualType.id,
          }
        }
      },
      include: { cards: true, role: true }
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, cards: { include: { type: true } } }
    });
    if (!user) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (e) {
    console.error('Ошибка входа:', e);
    res.status(500).json({ message: 'Ошибка на стороне базы данных' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Неверный логин или пароль' });

    const token = jwt.sign(
      { adminId: admin.id, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...adminData } = admin;
    res.json({ token, admin: adminData });
  } catch (e) {
    console.error('Ошибка входа администратора:', e);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        role: true,
        cards: {
          include: {
            type: true,
            transactions: {
              include: { category: true },
              orderBy: { date: 'desc' }
            }
          }
        },
        credits: true,
      }
    });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки данных' });
  }
});

// Карты
app.get('/api/cards', authenticateToken, async (req, res) => {
  try {
    const cards = await prisma.card.findMany({
      where: { userId: req.user.userId },
      include: { type: true }
    });
    res.json(cards);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка загрузки карт' });
  }
});

// Получение категорий
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (e) {
    console.error('Ошибка загрузки категорий:', e);
    res.status(500).json({ message: 'Ошибка загрузки категорий' });
  }
});

app.post('/api/reissue-card', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const virtualType = await prisma.cardType.findUnique({ where: { name: 'VIRTUAL' } });
    if (!virtualType) return res.status(500).json({ message: 'Тип карты VIRTUAL не найден' });

    const newCardNumber = '4455' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const newCard = await prisma.card.create({
      data: {
        userId,
        cardNumber: newCardNumber,
        expiry: '12/28',
        typeId: virtualType.id
      },
      include: { type: true }
    });
    res.json(newCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при перевыпуске карты' });
  }
});

app.post('/api/cards/:id/reissue', authenticateToken, async (req, res) => {
  const cardId = parseInt(req.params.id);
  const userId = req.user.userId;
  try {
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) return res.status(404).json({ message: 'Карта не найдена' });
    if (card.userId !== userId) return res.status(403).json({ message: 'Доступ запрещён' });

    const newCardNumber = '4455' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const newExpiry = '12/30';
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        cardNumber: newCardNumber,
        expiry: newExpiry,
        isBlocked: false
      },
      include: { type: true }
    });
    res.json(updatedCard);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка при перевыпуске карты' });
  }
});

// Обновление настроек конкретной карты (лимит и блокировка)
app.patch('/api/cards/:cardId/settings', authenticateToken, async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  const userId = req.user.userId;
  const { monthlyLimit, isBlocked } = req.body;

  // Принадлежит ли карта пользователю
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId }
  });
  if (!card) return res.status(404).json({ message: 'Карта не найдена' });

  try {
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        monthlyLimit: monthlyLimit !== undefined ? monthlyLimit : undefined,
        isBlocked: isBlocked !== undefined ? isBlocked : undefined
      }
    });
    res.json(updatedCard);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка сохранения настроек' });
  }
});

// Финансовые операции
app.post('/api/deposit', authenticateToken, async (req, res) => {
  const { cardId, amount } = req.body;
  const userId = req.user.userId;
  if (!cardId || !amount || amount <= 0) return res.status(400).json({ message: 'Некорректная сумма' });

  try {
    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card || card.userId !== userId) return res.status(404).json({ message: 'Карта не найдена' });
    if (card.isBlocked) return res.status(403).json({ message: 'Карта заблокирована, пополнение невозможно' });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } }
    });

    await prisma.transaction.create({
      data: {
        name: 'Пополнение счета',
        amount,
        type: 'plus',
        icon: '💰',
        cardId: card.id,
        categoryId: null
      }
    });

    const { password: _, ...userData } = updatedUser;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при пополнении' });
  }
});

app.post('/api/transfer', authenticateToken, async (req, res) => {
  const { fromCardId, toCardNumber, amount, name, categoryId } = req.body;
  const userId = req.user.userId;

  if (!fromCardId || !toCardNumber || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const fromCard = await tx.card.findUnique({ where: { id: fromCardId } });
      if (!fromCard || fromCard.userId !== userId) throw new Error('Карта отправителя не найдена или не принадлежит вам');
      if (fromCard.isBlocked) throw new Error('Карта отправителя заблокирована');

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (user.balance < amount) throw new Error('Недостаточно средств');

      const toCard = await tx.card.findUnique({ where: { cardNumber: toCardNumber } });
      if (!toCard) throw new Error('Карта получателя не найдена');
      if (toCard.isBlocked) throw new Error('Карта получателя заблокирована');

      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });

      await tx.user.update({
        where: { id: toCard.userId },
        data: { balance: { increment: amount } }
      });

      const senderTransaction = await tx.transaction.create({
        data: {
          name: name || `Перевод на карту ${toCardNumber.slice(-4)}`,
          amount,
          type: 'minus',
          icon: '💸',
          cardId: fromCardId,
          categoryId: categoryId || null
        }
      });

      const receiverTransaction = await tx.transaction.create({
        data: {
          name: name || `Перевод от карты ${fromCard.cardNumber.slice(-4)}`,
          amount,
          type: 'plus',
          icon: '💸',
          cardId: toCard.id,
          categoryId: categoryId || null
        }
      });

      return { senderTransaction, receiverTransaction };
    });

    res.json({ message: 'Перевод выполнен', result });
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
});

// Аналитика
app.get('/api/user/:id/analytics/categories', authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  if (req.user.userId !== userId) return res.sendStatus(403);

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        card: { userId },
        type: 'minus'
      },
      include: { category: true }
    });

    const categoryMap = {};
    transactions.forEach(t => {
      const catName = t.category?.name || 'Без категории';
      if (!categoryMap[catName]) {
        categoryMap[catName] = 0;
      }
      categoryMap[catName] += t.amount;
    });

    const result = Object.entries(categoryMap).map(([category, total]) => ({
      category,
      total
    }));
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка аналитики' });
  }
});

// Кредиты
function calculateMonthlyPayment(amount, months, annualRate) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return amount / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return amount * monthlyRate * factor / (factor - 1);
}

// Эндпоинт для получения индивидуальной ставки
app.get('/api/credit/rate', authenticateToken, async (req, res) => {
  try {
    const rate = await calculateInterestRate(req.user.userId);
    res.json({ rate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка расчёта ставки' });
  }
});

// Оформление кредита
app.post('/api/credit/apply', authenticateToken, async (req, res) => {
  const { amount, termMonths } = req.body;
  const userId = req.user.userId;

  if (!amount || amount <= 0 || !termMonths || termMonths < 1) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }

  try {
    const existing = await prisma.credit.findFirst({
      where: { userId, status: { in: ['active', 'overdue'] } }
    });
    if (existing) {
      return res.status(400).json({ message: 'У вас уже есть активный кредит' });
    }

    let interestRate;
    try {
      interestRate = await calculateInterestRate(userId);
    } catch (err) {
      console.error('Ошибка скоринга, используется ставка по умолчанию 12%', err);
      interestRate = 12.0;
    }

    const monthlyPayment = calculateMonthlyPayment(amount, termMonths, interestRate);
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    const credit = await prisma.credit.create({
      data: {
        userId,
        amount,
        termMonths,
        monthlyPayment,
        available: amount,
        interestRate,
        nextPaymentDate,
        status: 'active',
        penalty: 0
      }
    });

    res.json(credit);
  } catch (e) {
    console.error('Ошибка при оформлении кредита:', e);
    res.status(500).json({ message: 'Ошибка при оформлении кредита', error: e.message });
  }
});

// Получение кредита с автоплатежом
app.get('/api/credit', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    let credit = await prisma.credit.findFirst({
      where: { userId, status: { in: ['active', 'overdue'] } },
      orderBy: { issuedAt: 'desc' }
    });
    if (!credit) return res.json(null);

    const now = new Date();
    let updated = false;

    // Автоматическое списание при наступлении даты платежа
    while (now >= credit.nextPaymentDate && credit.status !== 'closed') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const totalDue = credit.monthlyPayment;

      if (user.balance >= totalDue) {
        // Списание
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: userId },
            data: { balance: { decrement: totalDue } }
          });

          const monthlyRate = credit.interestRate / 100 / 12;
          const interestPayment = credit.available * monthlyRate;
          const principalPayment = totalDue - interestPayment;
          let newAvailable = credit.available + principalPayment;
          if (newAvailable > credit.amount) newAvailable = credit.amount;

          await tx.credit.update({
            where: { id: credit.id },
            data: {
              available: newAvailable,
              nextPaymentDate: new Date(credit.nextPaymentDate.setMonth(credit.nextPaymentDate.getMonth() + 1)),
              status: newAvailable >= credit.amount ? 'closed' : 'active',
              penalty: 0
            }
          });

          const cardId = await getFirstActiveCardId(userId);
          await tx.transaction.create({
            data: {
              name: 'Автоматическое списание по кредиту',
              amount: totalDue,
              type: 'minus',
              icon: '🏦',
              cardId: cardId,
              categoryId: null
            }
          });
        });
        credit = await prisma.credit.findUnique({ where: { id: credit.id } });
        updated = true;
      } else {
        // Недостаточно средств – начисление пени
        const daysOverdue = Math.floor((now - credit.nextPaymentDate) / (1000 * 60 * 60 * 24));
        if (daysOverdue > 0) {
          const penaltyRate = 0.001;
          const penalty = totalDue * penaltyRate * daysOverdue;
          await prisma.credit.update({
            where: { id: credit.id },
            data: {
              penalty: credit.penalty + penalty,
              status: 'overdue'
            }
          });
          credit = await prisma.credit.findUnique({ where: { id: credit.id } });
          updated = true;
        }
        break;
      }
    }

    if (updated) {
      credit = await prisma.credit.findUnique({ where: { id: credit.id } });
    }

    const result = {
      ...credit,
      debt: credit.amount - credit.available,
      available: credit.available
    };
    res.json(result);
  } catch (e) {
    console.error('Ошибка получения кредита:', e);
    res.status(500).json({ message: 'Ошибка получения кредита' });
  }
});

// Снятие средств с кредита
app.post('/api/credit/withdraw', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Некорректная сумма' });

  try {
    const credit = await prisma.credit.findFirst({
      where: { userId, status: { in: ['active', 'overdue'] } }
    });
    if (!credit) return res.status(404).json({ message: 'Активный кредит не найден' });
    if (amount > credit.available) {
      return res.status(400).json({ message: 'Сумма превышает доступный остаток кредита' });
    }

    const cardId = await getFirstActiveCardId(userId);

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } }
      });
      const updated = await tx.credit.update({
        where: { id: credit.id },
        data: { available: credit.available - amount }
      });
      await tx.transaction.create({
        data: {
          name: 'Снятие с кредитной карты',
          amount,
          type: 'plus',
          icon: '💳',
          cardId: cardId,
          categoryId: null
        }
      });
      return updated;
    });

    res.json({ message: 'Средства переведены на карту', credit: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка при снятии' });
  }
});

// Погашение кредита
app.post('/api/credit/repay', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.userId;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Некорректная сумма' });

  try {
    const credit = await prisma.credit.findFirst({
      where: { userId, status: { in: ['active', 'overdue'] } }
    });
    if (!credit) return res.status(404).json({ message: 'Активный кредит не найден' });

    const debt = credit.amount - credit.available;
    const totalDebt = debt + credit.penalty;
    if (amount > totalDebt) {
      return res.status(400).json({ message: 'Сумма превышает задолженность' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Недостаточно средств на балансе' });
    }

    const cardId = await getFirstActiveCardId(userId);

    const result = await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { balance: { decrement: amount } } });

      let availableAfter = credit.available;
      let penaltyAfter = credit.penalty;
      let rest = amount;

      if (rest > 0 && penaltyAfter > 0) {
        const payPenalty = Math.min(rest, penaltyAfter);
        penaltyAfter -= payPenalty;
        rest -= payPenalty;
      }
      if (rest > 0) {
        availableAfter += rest;
        rest = 0;
      }

      const newDebt = credit.amount - availableAfter;
      const statusAfter = (newDebt <= 0 && penaltyAfter <= 0) ? 'closed' : (newDebt > 0 && penaltyAfter > 0 ? 'overdue' : 'active');

      const updated = await tx.credit.update({
        where: { id: credit.id },
        data: {
          available: availableAfter,
          penalty: penaltyAfter,
          status: statusAfter
        }
      });

      await tx.transaction.create({
        data: {
          name: 'Погашение кредита',
          amount,
          type: 'minus',
          icon: '🏦',
          cardId: cardId,
          categoryId: null
        }
      });

      return updated;
    });

    res.json({ message: 'Платёж выполнен', credit: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка при погашении' });
  }
});

// Админские маршруты
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true, cards: { include: { type: true } }, credits: true }
    });
    const usersWithoutPass = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    res.json(usersWithoutPass);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки пользователей' });
  }
});

app.patch('/api/admin/users/:id/toggle-block', requireAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    await prisma.card.updateMany({
      where: { userId },
      data: { isBlocked: { set: !user.isBlocked } }
    });
    res.json({ message: 'Статус карт изменён' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка при обновлении' });
  }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBalance = await prisma.user.aggregate({ _sum: { balance: true } });
    const totalTransactions = await prisma.transaction.count();
    const totalCards = await prisma.card.count();
    const totalCredits = await prisma.credit.count();

    res.json({
      totalUsers,
      totalBalance: totalBalance._sum.balance || 0,
      totalTransactions,
      totalCards,
      totalCredits
    });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка статистики' });
  }
});

app.get('/api/admin/transactions', requireAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0, userId, categoryId, type, from, to } = req.query;
    const where = {};
    if (userId) where.card = { userId: parseInt(userId) };
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (type) where.type = type;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const transactions = await prisma.transaction.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { date: 'desc' },
      include: { card: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } }, category: true }
    });
    const total = await prisma.transaction.count({ where });
    res.json({ transactions, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки транзакций' });
  }
});

app.get('/api/admin/credits', requireAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0, userId, status } = req.query;
    const where = {};
    if (userId) where.userId = parseInt(userId);
    if (status) where.status = status;

    const credits = await prisma.credit.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
    });
    const total = await prisma.credit.count({ where });
    res.json({ credits, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки кредитов' });
  }
});

app.get('/api/admin/credits/:id', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const credit = await prisma.credit.findUnique({
      where: { id },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
    });
    if (!credit) return res.status(404).json({ message: 'Кредит не найден' });
    res.json(credit);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка загрузки кредита' });
  }
});

app.get('/api/admin/users/:userId', requireAdmin, async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        cards: {
          include: {
            type: true,
            transactions: {
              include: { category: true },
              orderBy: { date: 'desc' }
            }
          }
        },
        credits: true
      }
    });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
    const { password, ...userData } = user;
    res.json(userData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки данных' });
  }
});

// Запуск
app.listen(PORT, () => {
  console.log(`
  ✅ NEOBANK SERVER СТАРТОВАЛ
  📡 Порт: ${PORT}
  🔗 DB_URL: Подключено через Prisma
  `);
});