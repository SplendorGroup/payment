import { Order, Item, Prisma } from '@prisma/client';

export type ModelName = 'order' | 'item';

export type PrismaModels = {
  order: Prisma.OrderDelegate<any>;
  item: Prisma.ItemDelegate<any>;
};
export type ModelType<M extends keyof PrismaModels> = PrismaModels[M];

interface Data {
  order: Order;
  item: Item;
}

interface PrismaRelations {
  item: {
    order?: Order;
  } & Item;
  order: {
    items?: Item[];
  } & Order;
}

type PrismaRelationPayload<T extends keyof PrismaRelations> =
  PrismaRelations[T];

export type DataType<T extends keyof Data> = Data[T];

export interface IPrisma<T extends keyof Data> {
  create: (data: Partial<DataType<T>>) => Promise<DataType<T>>;
  createMany: (data: Partial<DataType<T>[]>) => Promise<DataType<T>>;
  findOne: (filter: Partial<DataType<T>>) => Promise<DataType<T> | null>;
  findById: (id: string) => Promise<DataType<T> | null>;
  findAll: (
    filter?: { skip?: number; take?: number } & Partial<DataType<T>>,
  ) => Promise<DataType<T>[]>;
  update: (id: string, data: Partial<DataType<T>>) => Promise<T | null>;
  updateMany: (filter: Partial<DataType<T>>) => Promise<T[]>;
  deleteById: (id: string) => Promise<void>;
  deleteMany: (filter: Partial<DataType<T>>) => Promise<void>;
  findByIdWithRelations: (
    id: string,
    relations: any[],
  ) => Promise<PrismaRelationPayload<T> | null>;
  findOneWithRelations: (
    relations: any[],
    filter?: Partial<DataType<any>>,
  ) => Promise<PrismaRelationPayload<T>>;
  findAllWithRelations: (
    relations: any[],
    filter?: { skip?: number; take?: number } & Partial<DataType<any>>,
  ) => Promise<PrismaRelationPayload<T>[]>;
}

export interface IPrismaRepository {
  create: (data: unknown) => Promise<unknown>;
  createMany: (data: unknown[]) => Promise<any[]>;
  findOne: (filter: Partial<unknown>) => Promise<unknown | null>;
  findById: (id: string) => Promise<unknown | null>;
  findAll: (filter: Partial<unknown>) => Promise<unknown[]>;
  update: (id: string, data: Partial<unknown>) => Promise<unknown | null>;
  deleteById: (id: string) => Promise<void>;
  deleteMany: (filter: Partial<unknown>) => Promise<void>;
  findByIdWithRelations: (
    id: string,
    relations: any[],
  ) => Promise<unknown | null>;
  findAllWithRelations: (
    relations: any[],
    filter?: Partial<any>,
  ) => Promise<any>;
}
