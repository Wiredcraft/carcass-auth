test:
	@NODE_ENV=test DEBUG=carcass:*,carcass-auth:* ./node_modules/.bin/mocha ./test/*.mocha.js

.PHONY: test
