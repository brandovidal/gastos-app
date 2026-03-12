import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Credit Cards
  const creditCards = [
    { code: "cmr", name: "CMR Falabella", billingCloseDay: 10, paymentDueDay: 5, color: "#7C3AED" },
    { code: "oh", name: "Oh Pay", billingCloseDay: 10, paymentDueDay: 3, color: "#10B981" },
    { code: "io", name: "Interbank IO", billingCloseDay: 25, paymentDueDay: 12, color: "#3B82F6" },
    { code: "amex", name: "AMEX", billingCloseDay: 21, paymentDueDay: 15, color: "#F59E0B" },
  ];

  for (const card of creditCards) {
    await prisma.creditCard.upsert({
      where: { code: card.code },
      update: card,
      create: card,
    });
  }

  // Categories
  const categories = [
    { name: "Personal", color: "#8B5CF6", icon: "user", isDefault: true },
    { name: "Prestamo", color: "#10B981", icon: "banknote", isDefault: true },
    { name: "Salud", color: "#3B82F6", icon: "heart-pulse", isDefault: true },
    { name: "Casa", color: "#6B7280", icon: "home", isDefault: true },
    { name: "Junta", color: "#EAB308", icon: "users", isDefault: true },
    { name: "Trabajo", color: "#64748B", icon: "briefcase", isDefault: true },
    { name: "Estudio", color: "#3B82F6", icon: "graduation-cap", isDefault: true },
    { name: "Comida", color: "#F97316", icon: "utensils", isDefault: true },
    { name: "Transporte", color: "#06B6D4", icon: "car", isDefault: true },
    { name: "Entretenimiento", color: "#EC4899", icon: "gamepad-2", isDefault: true },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat,
    });
  }

  // Sample data for dashboard
  const personalCat = await prisma.category.findUnique({ where: { name: "Personal" } });
  const casaCat = await prisma.category.findUnique({ where: { name: "Casa" } });
  const comidaCat = await prisma.category.findUnique({ where: { name: "Comida" } });
  const saludCat = await prisma.category.findUnique({ where: { name: "Salud" } });
  const transporteCat = await prisma.category.findUnique({ where: { name: "Transporte" } });

  if (personalCat && casaCat && comidaCat && saludCat && transporteCat) {
    // Fixed costs for March 2026
    const fixedCosts = [
      { description: "Luz - Enel", amount: 85.5, categoryId: casaCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pagado", account: "BCP" },
      { description: "Agua - Sedapal", amount: 45.0, categoryId: casaCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pendiente", account: "BCP" },
      { description: "Internet - Movistar", amount: 89.9, categoryId: casaCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pagado", account: "Interbank" },
      { description: "Gym", amount: 120.0, categoryId: personalCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "con_culpa", paymentStatus: "pagado" },
      { description: "Consulta médica", amount: 150.0, categoryId: saludCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pendiente" },
      { description: "Gasolina", amount: 200.0, categoryId: transporteCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pagado" },
      { description: "Almuerzo semanal", amount: 350.0, categoryId: comidaCat.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pagado" },
    ];

    for (const fc of fixedCosts) {
      await prisma.fixedCost.create({ data: fc });
    }

    // Subscriptions
    const subscriptions = [
      { description: "Netflix", amount: 44.9, period: "mensual", person: "compartido", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pagado" },
      { description: "Spotify", amount: 22.9, period: "mensual", person: "personal", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pagado" },
      { description: "ChatGPT Plus", amount: 20.0, currency: "USD", exchangeRate: 3.72, amountInPEN: 74.4, period: "mensual", person: "personal", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pagado" },
      { description: "YouTube Premium", amount: 26.9, period: "mensual", person: "compartido", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pendiente" },
      { description: "iCloud 200GB", amount: 12.9, period: "mensual", person: "personal", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pagado" },
    ];

    for (const sub of subscriptions) {
      await prisma.subscription.create({ data: sub });
    }

    // Credit card expenses
    const cmr = await prisma.creditCard.findUnique({ where: { code: "cmr" } });
    const oh = await prisma.creditCard.findUnique({ where: { code: "oh" } });
    const io = await prisma.creditCard.findUnique({ where: { code: "io" } });

    if (cmr && oh && io) {
      const ccExpenses = [
        { description: "Wong supermercado", amount: 245.9, creditCardId: cmr.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pendiente" },
        { description: "Falabella ropa", amount: 189.0, creditCardId: cmr.id, person: "Danery", paymentMonth: 3, paymentYear: 2026, expenseType: "con_culpa", paymentStatus: "pendiente", installment: "1/3" },
        { description: "Plaza Vea", amount: 156.5, creditCardId: oh.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pendiente" },
        { description: "Farmacia", amount: 78.0, creditCardId: oh.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "necesario", paymentStatus: "pagado" },
        { description: "Amazon compra", amount: 45.0, currency: "USD", exchangeRate: 3.72, amountInPEN: 167.4, creditCardId: io.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, paymentStatus: "pendiente" },
        { description: "Rappi delivery", amount: 42.5, creditCardId: io.id, person: "Brando", paymentMonth: 3, paymentYear: 2026, expenseType: "con_culpa", paymentStatus: "pendiente" },
      ];

      for (const exp of ccExpenses) {
        await prisma.creditCardExpense.create({ data: exp });
      }
    }

    // Monthly summary
    await prisma.monthlySummary.upsert({
      where: { month_year: { month: 3, year: 2026 } },
      update: {},
      create: {
        month: 3,
        year: 2026,
        salary: 5000,
        totalFixedCosts: 1040.4,
        totalSubscriptions: 181.9,
        totalCMR: 434.9,
        totalOh: 234.5,
        totalIO: 209.9,
        totalAMEX: 0,
        totalExpenses: 2101.6,
        totalNecesario: 1564.1,
        totalConCulpa: 537.5,
        budgetLimit: 5000,
        surplus: 2898.4,
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
