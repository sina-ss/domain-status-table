import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

interface LogsQuery {
    search?: string;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    skip?: string;
    take?: string;
    statuses?: string;
}

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN }));

const fetchLogs = async (req: Request, res: Response, next: NextFunction) => {
  const { search, orderBy, orderDirection, skip, take, statuses }: LogsQuery = req.query;

  const statusArray = statuses?.split(",") || [];

  let orderConfig;
  if (orderBy && orderDirection) {
    orderConfig = {
      [orderBy]: orderDirection,
    };
  }

  const searchConditions = search
    ? {
        OR: [
          { domain: { contains: search } },
          { description: { contains: search } },
          { status: { contains: search } },
        ],
      }
    : {};

  try {
    const logs = await prisma.logs.findMany({
      where: {
        ...searchConditions,
        status: { in: statusArray }
      },
      orderBy: orderConfig,
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 10,
    });

    const totalLogs = await prisma.logs.count({
      where: {
        ...searchConditions,
        status: { in: statusArray }
      },
    });

    res.json({
      logs,
      total: totalLogs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    next(error);
  }
};

app.get('/logs', fetchLogs);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
