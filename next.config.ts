import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

import { inspect } from 'util'

inspect.defaultOptions.depth = null

const withNextIntl = createNextIntlPlugin('./src/app/_i18n/request.ts')

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
  },
}

export default withNextIntl(nextConfig)
