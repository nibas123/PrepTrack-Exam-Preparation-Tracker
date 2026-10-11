export const environment = {
  production: true,
  supabaseUrl: 'https://bxzfrusibipifrhukpdx.supabase.co',
  supabaseAnonKey: 'sb_publishable_yrUhb8gyXofgHqFvlFZtBA_HRDwufFc',
  geminiApiKey: typeof atob !== 'undefined' ? atob('QVEuQWI4Uk42TFQwWFJoQ0VWVlBpdjIwaGNsNVBUMFZyOUtmZlRDeFA1SzBmT2R0MUpfM0E=') : '',
  geminiApiKeyFallback: typeof atob !== 'undefined' ? atob('QVEuQWI4Uk42S21IU19YaW5iYjAtMHRNMldSeHU2azNLYmdlaEJuY0lWeTlVU1lyNk1UVlE=') : '',
};
