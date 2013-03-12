test:
	@NODE_ENV=test DEBUG=carcass:*,carcass-auth:* ./node_modules/.bin/mocha ./test/*.mocha.js ./test/login_local/*.mocha.js ./test/login_session/*.mocha.js

.PHONY: test
