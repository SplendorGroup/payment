import { IPrismaRepository } from '@/domain/contracts/prisma.contract';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaRepository implements IPrismaRepository {
  private readonly model: any;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly modelName: string,
  ) {
    if (!(this.modelName in this.prisma)) {
      throw new InternalServerErrorException(
        `Invalid model name: ${this.modelName}`,
      );
    }
    this.model = this.prisma[String(this.modelName).toLowerCase()];
  }
  async createMany(data: unknown[]) {
    try {
      const createdRecord = await this.model.createMany({
        data,
      });
      return createdRecord as any[];
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create record: ${error.message}`,
      );
    }
  }

  async create(data: any): Promise<any> {
    try {
      const createdRecord = await this.model.create({
        data,
      });
      return createdRecord;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create record: ${error.message}`,
      );
    }
  }

  async findOne(filter): Promise<any> {
    try {
      const foundRecord = await this.model.findFirst({
        where: filter,
      });
      return foundRecord;
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const foundRecord = await this.model.findUnique({
        where: { id },
      });
      return foundRecord;
    } catch (error) {
      return null;
    }
  }

  async findAll(
    filter?: { skip?: number; take?: number } & Partial<unknown>,
  ): Promise<unknown[]> {
    try {
      const { skip, take, ...where } = filter;

      if (skip !== undefined && take !== undefined) {
        const allRecords = await this.model.findMany({
          where,
          skip: skip,
          take: take,
        });
        return allRecords;
      }

      const allRecords = await this.model.findMany({
        where,
      });
      return allRecords;
    } catch (error) {
      return [];
    }
  }

  async update(id: string, data: Partial<unknown>): Promise<unknown> {
    try {
      const updatedRecord = await this.model.update({
        where: { id },
        data,
      });
      return updatedRecord;
    } catch (error) {
      return [];
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.model.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete record by ID: ${error.message}`,
      );
    }
  }

  async deleteMany(filter: Partial<unknown>): Promise<void> {
    try {
      await this.model.deleteMany({
        where: filter,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete multiple records: ${error.message}`,
      );
    }
  }

  async findByIdWithRelations(
    id: string,
    relations: any[],
  ): Promise<unknown> {
    try {
      const foundRecord = await this.model.findUnique({
        where: { idempotent_key: id },
        include: this.mapRelations(relations),
      });
      return foundRecord;
    } catch (error) {
      return null;
    }
  }

  async findAllWithRelations(
    relations: any[],
    filter?: { skip?: number; take?: number } & Partial<any>,
  ): Promise<any> {
    try {
      const { skip, take, ...where } = filter || {};
      const includeRelations = this.mapRelations(relations);

      if (skip !== undefined && take !== undefined) {
        const allRecords = await this.model.findMany({
          where,
          include: includeRelations,
          skip: skip,
          take: take,
        });
        return allRecords;
      } else {
        const allRecords = await this.model.findMany({
          where,
          include: includeRelations,
        });
        return allRecords;
      }
    } catch (error) {
      return [];
    }
  }

  async findOneWithRelations(
    relations: any[],
    filter?: { skip?: number; take?: number } & Partial<any>,
  ): Promise<any> {
    try {
      const { skip, take, ...where } = filter || {};
      const includeRelations = this.mapRelations(relations);

      const allRecords = await this.model.findFirst({
        where,
        include: includeRelations,
      });

      return allRecords;
    } catch (error) {
      return [];
    }
  }

  private mapRelations(relations: any[]): Record<string, true> {
    return relations.reduce((acc, relation) => {
      acc[relation] = true;
      return acc;
    }, {});
  }
}
