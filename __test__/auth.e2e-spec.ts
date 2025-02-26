import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { AppModule } from '@src/app.module';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

describe('AuthModule (e2e)', (): void => {
  let app: INestApplication;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const falsePrivateTest = (query: string) => baseTest().set('x-jwt', 'xxx').send({ query });

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();

    await app.init();
  });

  afterAll(async (): Promise<void> => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('로그인', (): void => {
    it.todo('로그인 성공');
    it.todo('로그인 실패 - 유저 정보 불일치');
  });

  describe('내 id 조회', (): void => {
    it.todo('내 id 조회 성공');
    it.todo('내 id 조회 - 유저 토큰 불일치');
  });
});
