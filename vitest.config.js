export default {
    test: {
        environment: 'node',
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        server: {
          deps: {
            inline: [/src\/.*/, /test\/.*/]
          }
        }
      }
}
