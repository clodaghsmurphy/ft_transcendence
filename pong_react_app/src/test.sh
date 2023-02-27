curl -F grant_type=authorization_code \
-F client_id=u-s4t2ud-7d598554f8eefe591e24f18daf48ab752d062cd486ebfb0b0996b96cb3d06262 \
-F client_secret=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 \
-F code=bf4d17a97042d64da98422a2e2219a260ab6d2726800258a11dbb30fe6d4589b \
-F redirect_uri=http://localhost:8080/login/callback \
-X POST https://api.intra.42.fr/oauth/token
