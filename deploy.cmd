npm run build
tar -cvf ./deploy.tar --exclude='*.map' ./captain-definition ./dist/*
caprover deploy -d -t ./deploy.tar