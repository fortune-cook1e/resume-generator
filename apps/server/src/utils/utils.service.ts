import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/schema';

@Injectable()
export class UtilsService {
  logger = new Logger(UtilsService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService<Config>,
  ) {}

  async getCacheOrSet<T>(
    key: string,
    callback: () => Promise<T> | T,
    ttl: number = this.configService.getOrThrow('REDIS_DEFAULT_TTL'),
    type: 'json' | 'string' = 'json',
  ): Promise<T> {
    const start = performance.now();

    const cachedValue = (await this.cacheManager.get(key)) as T;
    const duration = Number(performance.now() - start).toFixed(0);

    if (!cachedValue) {
      this.logger.debug(`Cache miss for ${key} (${duration}ms)`);
    } else {
      this.logger.debug(`Cache hit for ${key} (${duration}ms)`);
    }

    const isString = type === 'string';

    if (cachedValue) {
      return isString ? cachedValue : JSON.parse(cachedValue as string);
    }

    const value = await callback();
    const valueToCache = isString ? value : JSON.stringify(value);

    // store
    // FixBug: fix the bug that could not change ttl
    await this.cacheManager.set(key, valueToCache, { ttl } as any);

    return value;
  }
}