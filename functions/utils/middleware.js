import { checkDatabaseConfig as checkDbConfig } from './databaseAdapter.js';

export async function errorHandling(context) {
  try {
    return await context.next();
  } catch (error) {
    console.error('Unhandled error:', error?.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        message: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function telemetryData(context) {
  try {
    return await context.next();
  } catch (e) {
    console.log('telemetryData error:', e);
    return context.next();
  }
}

export async function traceData(context, span, op, name) {
  // Workers 环境下 Sentry 不可用，直接跳过
}

async function fetchSampleRate(context) {
  return null;
}

// 检查数据库是否配置
export async function checkDatabaseConfig(context) {
  var env = context.env;

  var dbConfig = checkDbConfig(env);

  if (!dbConfig.configured) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "数据库未配置 / Database not configured",
        message: "请配置 KV 存储 (env.img_url) 或 D1 数据库 (env.img_d1)。 / Please configure KV storage (env.img_url) or D1 database (env.img_d1)."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  // 继续执行
  return await context.next();
}
