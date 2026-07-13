@echo off
aws --profile ricky s3 sync ./dist s3://solarpool/www
aws --profile ricky cloudfront create-invalidation --distribution-id E250RGBXRCVIFS --paths "/*"